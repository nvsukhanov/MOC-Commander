import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Inject,
    Input,
    OnDestroy,
    OnInit,
    Output,
    TemplateRef,
    ViewChild
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { JsonPipe, NgForOf, NgIf } from '@angular/common';
import { PushPipe } from '@ngrx/component';
import { TranslocoModule } from '@ngneat/transloco';
import { Store } from '@ngrx/store';
import { Subject, Subscription, filter, finalize, map, take, takeUntil } from 'rxjs';
import { Actions, concatLatestFrom, ofType } from '@ngrx/effects';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

import { ControlSchemeBindingInputComponent } from '../binding-input';
import { ControlSchemeBindingOutputComponent } from '../binding-output';
import { FeatureToolbarService, IScrollContainer, SCROLL_CONTAINER, ScreenSizeObserverService, WINDOW } from '../../../common'; // TODO: create alias for this
import { ControlSchemeFormFactoryService } from './control-scheme-form-factory.service';
import { EditSchemeForm } from '../types';
import { ControlSchemeBindingConfigurationComponent } from '../binding-config';
import {
    CONTROLLERS_ACTIONS,
    CONTROLLER_INPUT_SELECTORS,
    CONTROL_SCHEME_CONFIGURATION_ACTIONS,
    CONTROL_SCHEME_CONFIGURATION_STATE_SELECTORS,
    ControlScheme,
    ControllerInput,
    HUB_ATTACHED_IO_SELECTORS
} from '../../../store';

export type BindingFormResult = ReturnType<EditSchemeForm['getRawValue']>;

@Component({
    standalone: true,
    selector: 'app-control-scheme-edit-form',
    templateUrl: './control-scheme-edit-form.component.html',
    styleUrls: [ './control-scheme-edit-form.component.scss' ],
    imports: [
        MatCardModule,
        MatButtonModule,
        NgIf,
        PushPipe,
        TranslocoModule,
        NgForOf,
        JsonPipe,
        ControlSchemeBindingInputComponent,
        ControlSchemeBindingOutputComponent,
        MatExpansionModule,
        MatInputModule,
        ReactiveFormsModule,
        ControlSchemeBindingConfigurationComponent,
        MatDividerModule,
        MatIconModule,
        RouterLink,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ControlSchemeEditFormComponent implements OnInit, OnDestroy {
    @Output() public readonly save = new EventEmitter<BindingFormResult>();

    @Output() public readonly cancel = new EventEmitter<void>();

    public readonly form = this.controlSchemeFormFactoryService.createEditSchemeForm(
        this.window.crypto.randomUUID(),
        'New Scheme' // TODO: translate
    );

    public readonly canAddBinding$ = this.store.select(CONTROL_SCHEME_CONFIGURATION_STATE_SELECTORS.canAddBinding);

    private readonly onDestroy$ = new Subject<void>();

    private _isSmallScreen = false;

    private sub?: Subscription;

    constructor(
        private readonly store: Store,
        @Inject(WINDOW) private readonly window: Window,
        private readonly controlSchemeFormFactoryService: ControlSchemeFormFactoryService,
        private readonly cdRef: ChangeDetectorRef,
        private readonly screenSizeObserverService: ScreenSizeObserverService,
        private readonly actions: Actions,
        private readonly featureToolbarService: FeatureToolbarService,
        @Inject(SCROLL_CONTAINER) private readonly scrollContainer: IScrollContainer
    ) {
    }

    @ViewChild('controlsTemplate', { static: true, read: TemplateRef })
    public set controlsTemplate(controls: TemplateRef<unknown> | null) {
        if (controls) {
            this.featureToolbarService.setControls(controls);
        } else {
            this.featureToolbarService.clearConfig();
        }
    }

    public get isSmallScreen(): boolean {
        return this._isSmallScreen;
    }

    public get isValid(): boolean {
        return this.form.valid;
    }

    @Input()
    public set scheme(scheme: ControlScheme) {
        this.form.reset();
        this.form.patchValue(scheme);
        scheme.bindings.forEach(binding => {
            const binging = this.controlSchemeFormFactoryService.createBindingForm(
                binding.id,
                binding.input.controllerId,
                binding.input.inputId,
                binding.input.inputType,
                binding.output.hubId,
                binding.output.portId,
                binding.output.operationMode,
                binding.output
            );
            this.form.controls.bindings.push(binging);
        });
        this.form.markAsPristine();
    }

    public ngOnInit(): void {
        this.sub = this.screenSizeObserverService.isSmallScreen$.subscribe((isSmallScreen) => {
            this._isSmallScreen = isSmallScreen;
            this.cdRef.markForCheck();
        });
        this.store.dispatch(CONTROLLERS_ACTIONS.waitForConnect());
    }

    public onSave(): void {
        this.save.emit(this.form.getRawValue());
    }

    public onCancel(): void {
        this.cancel.emit();
    }

    public ngOnDestroy(): void {
        this.featureToolbarService.clearConfig();
        this.sub?.unsubscribe();
        this.onDestroy$.next();
        this.onDestroy$.complete();
    }

    public addBinding(): void {
        this.startInputCapture();
        this.store.select(CONTROLLER_INPUT_SELECTORS.selectFirst).pipe(
            takeUntil(this.onDestroy$),
            takeUntil(this.actions.pipe(ofType(CONTROL_SCHEME_CONFIGURATION_ACTIONS.stopListening))),
            filter((input): input is ControllerInput => !!input),
            concatLatestFrom((input) => this.store.select(HUB_ATTACHED_IO_SELECTORS.selectFirstIOControllableByInputType(input.inputType))),
            map(([ input, ios ]) => ({ input, ios })),
            take(1),
            finalize(() => this.stopInputCapture())
        ).subscribe({
            next: ({ input, ios }) => {
                const io = ios[0];
                if (!io) {
                    return; // TODO: notify on no matching IO
                }
                const binging = this.controlSchemeFormFactoryService.createBindingForm(
                    this.window.crypto.randomUUID(),
                    input.controllerId,
                    input.inputId,
                    input.inputType,
                    ios[0].ioConfig.hubId,
                    ios[0].ioConfig.portId,
                    ios[0].operationModes[0]
                );
                this.form.controls.bindings.push(binging);
                this.cdRef.detectChanges();
                this.scrollContainer.scrollToBottom();
            }
        });
    }

    public removeBindingIndex(index: number): void {
        this.form.controls.bindings.removeAt(index);
        this.cdRef.markForCheck();
    }

    public cancelAddBinging(): void {
        this.stopInputCapture();
    }

    private startInputCapture(): void {
        this.store.dispatch(CONTROL_SCHEME_CONFIGURATION_ACTIONS.startListening());
    }

    private stopInputCapture(): void {
        this.store.dispatch(CONTROL_SCHEME_CONFIGURATION_ACTIONS.stopListening());
    }
}
