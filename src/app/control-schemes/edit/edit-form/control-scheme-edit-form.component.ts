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
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { Store } from '@ngrx/store';
import { Subject, Subscription, filter, finalize, map, take, takeUntil } from 'rxjs';
import { Actions, concatLatestFrom, ofType } from '@ngrx/effects';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

import {
    ConfirmDialogService,
    ControllerInputType,
    FeatureToolbarService,
    HUB_IO_CONTROL_METHODS,
    IScrollContainer,
    SCROLL_CONTAINER,
    ScreenSizeObserverService,
    WINDOW
} from '@app/shared';
import { ControlSchemeBindingInputComponent } from '../binding-input';
import { ControlSchemeBindingOutputComponent } from '../binding-output';
import { ControlSchemeFormBuilderService } from './control-scheme-form-builder.service';
import { BindingForm, EditSchemeForm } from '../types';
import { ControlSchemeBindingConfigurationComponent } from '../binding-config';
import {
    CONTROLLERS_ACTIONS,
    CONTROLLER_INPUT_SELECTORS,
    CONTROL_SCHEME_ACTIONS,
    ControlSchemeModel,
    ControllerInputModel,
    HUB_ATTACHED_IO_SELECTORS,
} from '../../../store';
import { CONTROL_SCHEMES_LIST_SELECTORS } from '../../contorl-schemes-list.selectors';

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
        this.translocoService.translate('controlScheme.newSchemeDefaultName')
    );

    public readonly canAddBinding$ = this.store.select(CONTROL_SCHEMES_LIST_SELECTORS.canAddBinding);

    private readonly onDestroy$ = new Subject<void>();

    private _isSmallScreen = false;

    private readonly sub: Subscription = new Subscription();

    constructor(
        private readonly store: Store,
        @Inject(WINDOW) private readonly window: Window,
        private readonly controlSchemeFormFactoryService: ControlSchemeFormBuilderService,
        private readonly cdRef: ChangeDetectorRef,
        private readonly screenSizeObserverService: ScreenSizeObserverService,
        private readonly actions: Actions,
        private readonly featureToolbarService: FeatureToolbarService,
        @Inject(SCROLL_CONTAINER) private readonly scrollContainer: IScrollContainer,
        private readonly translocoService: TranslocoService,
        private readonly confirmDialogService: ConfirmDialogService
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

    @Input()
    public set scheme(scheme: ControlSchemeModel) {
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
        this.sub.add(this.screenSizeObserverService.isSmallScreen$.subscribe((isSmallScreen) => {
            this._isSmallScreen = isSmallScreen;
            this.cdRef.markForCheck();
        }));
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
        this.confirmDialogService.hide(this);
    }

    public addBinding(): void {
        this.startInputCapture();
        this.store.select(CONTROLLER_INPUT_SELECTORS.selectFirst).pipe(
            takeUntil(this.onDestroy$),
            takeUntil(this.actions.pipe(ofType(CONTROL_SCHEME_ACTIONS.stopListening))),
            filter((input): input is ControllerInputModel => !!input),
            concatLatestFrom((input) => this.store.select(HUB_ATTACHED_IO_SELECTORS.selectFirstIiControllableByInputType(input.inputType))),
            map(([ input, ios ]) => ({ input, ios })),
            take(1),
            finalize(() => this.stopInputCapture())
        ).subscribe({
            next: ({ input, ios }) => {
                const io = ios[0];
                if (!io) {
                    this.store.dispatch(CONTROL_SCHEME_ACTIONS.noIOForInputFound());
                    return;
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

    public rebindInput(
        binding: BindingForm
    ): void {
        const ioOperationMode = binding.controls.output.controls.operationMode.value;
        const applicableInputTypes = new Set(Object.keys(HUB_IO_CONTROL_METHODS).filter((inputType) => {
            return HUB_IO_CONTROL_METHODS[inputType as ControllerInputType][ioOperationMode] !== undefined;
        }));

        this.startInputCapture();
        this.store.select(CONTROLLER_INPUT_SELECTORS.selectFirst).pipe(
            takeUntil(this.onDestroy$),
            takeUntil(this.actions.pipe(ofType(CONTROL_SCHEME_ACTIONS.stopListening))),
            filter((input): input is ControllerInputModel => !!input),
            take(1),
            finalize(() => this.stopInputCapture())
        ).subscribe((input) => {
            if (!applicableInputTypes.has(input.inputType)) {
                this.store.dispatch(CONTROL_SCHEME_ACTIONS.inputRebindTypeMismatch());
                return;
            }
            binding.controls.input.patchValue({
                controllerId: input.controllerId,
                inputId: input.inputId,
                inputType: input.inputType
            });
            this.store.dispatch(CONTROL_SCHEME_ACTIONS.inputRebindSuccess());
            this.cdRef.detectChanges();
        });
    }

    public removeBindingIndex(index: number): void {
        this.form.controls.bindings.removeAt(index);
        this.cdRef.markForCheck();
    }

    private startInputCapture(): void {
        this.store.dispatch(CONTROL_SCHEME_ACTIONS.startListening());
    }

    private stopInputCapture(): void {
        this.store.dispatch(CONTROL_SCHEME_ACTIONS.stopListening());
    }
}
