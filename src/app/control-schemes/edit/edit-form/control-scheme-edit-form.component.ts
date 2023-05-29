import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, Input, OnDestroy } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import {
    CONTROL_SCHEME_CONFIGURATION_ACTIONS,
    CONTROL_SCHEME_CONFIGURATION_STATE_SELECTORS,
    CONTROLLER_INPUT_SELECTORS,
    ControllerInput,
    ControlScheme,
    HUB_ATTACHED_IO_SELECTORS,
    HUBS_SELECTORS
} from '../../../store';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { JsonPipe, NgForOf, NgIf } from '@angular/common';
import { PushPipe } from '@ngrx/component';
import { TranslocoModule } from '@ngneat/transloco';
import { Store } from '@ngrx/store';
import { filter, map, of, Subject, take, takeUntil } from 'rxjs';
import { concatLatestFrom } from '@ngrx/effects';
import { ControlSchemeBindingInputComponent } from '../binding-input';
import { ControlSchemeBindingOutputComponent } from '../binding-output';
import { MatExpansionModule } from '@angular/material/expansion';
import { WINDOW } from '../../../common'; // TODO: create alias for this
import { MatInputModule } from '@angular/material/input';
import { ControlSchemeFormFactoryService } from './control-scheme-form-factory.service';
import { EditSchemeForm } from '../types';
import { ControlSchemeBindingConfigurationComponent } from '../binding-config';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';

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
        MatProgressBarModule
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ControlSchemeEditFormComponent implements OnDestroy {
    public readonly form = this.controlSchemeFormFactoryService.createEditSchemeForm(
        this.window.crypto.randomUUID(),
        'New Scheme' // TODO: translate
    );

    public readonly canAddBinding$ = this.store.select(CONTROL_SCHEME_CONFIGURATION_STATE_SELECTORS.canAddBinding);

    public readonly canCancelBinding$ = this.store.select(CONTROL_SCHEME_CONFIGURATION_STATE_SELECTORS.canCancelBinding);

    private readonly onDestroy$ = new Subject<void>();

    private isCapturingInput = false;

    constructor(
        private readonly store: Store,
        @Inject(WINDOW) private readonly window: Window,
        private readonly controlSchemeFormFactoryService: ControlSchemeFormFactoryService,
        private readonly cdRef: ChangeDetectorRef
    ) {
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

    public getFormValue(): BindingFormResult {
        return this.form.getRawValue();
    }

    public ngOnDestroy(): void {
        this.onDestroy$.next();
        this.onDestroy$.complete();
        this.stopInputCapture();
    }

    public addBinding(): void {
        this.startInputCapture();
        this.store.select(CONTROLLER_INPUT_SELECTORS.selectFirst).pipe(
            takeUntil(this.onDestroy$),
            filter((input): input is ControllerInput => !!input),
            concatLatestFrom(() => this.store.select(HUBS_SELECTORS.selectHubs)),
            concatLatestFrom(([ input, hubs ]) =>
                hubs.length === 1
                ? this.store.select(HUB_ATTACHED_IO_SELECTORS.selectIOsControllableByInputType(hubs[0].hubId, input.inputType))
                : of([])
            ),
            map(([ [ input ], ios ]) => ({ input, ios })),
            take(1)
        ).subscribe({
            next: ({ input, ios }) => {
                this.stopInputCapture();
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
                this.cdRef.markForCheck();
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
        if (!this.isCapturingInput) {
            this.store.dispatch(CONTROL_SCHEME_CONFIGURATION_ACTIONS.startListening());
            this.isCapturingInput = true;
        }
    }

    private stopInputCapture(): void {
        if (this.isCapturingInput) {
            this.store.dispatch(CONTROL_SCHEME_CONFIGURATION_ACTIONS.stopListening());
            this.isCapturingInput = false;
        }
    }
}
