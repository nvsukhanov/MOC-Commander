import { ChangeDetectionStrategy, Component, Inject, Input, OnDestroy } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CONTROL_SCHEME_CONFIGURATION_STATE_SELECTORS, ControlScheme, GAMEPAD_ACTIONS, HUB_ATTACHED_IO_SELECTORS, HUBS_SELECTORS } from '../../../store';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { JsonPipe, NgForOf, NgIf } from '@angular/common';
import { PushModule } from '@ngrx/component';
import { TranslocoModule } from '@ngneat/transloco';
import { Store } from '@ngrx/store';
import { of, Subject, take, takeUntil } from 'rxjs';
import { Actions, concatLatestFrom, ofType } from '@ngrx/effects';
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
        PushModule,
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

    constructor(
        private readonly store: Store,
        private readonly actions: Actions,
        @Inject(WINDOW) private readonly window: Window,
        private readonly controlSchemeFormFactoryService: ControlSchemeFormFactoryService
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
                binding.input.gamepadId,
                binding.input.gamepadInputMethod,
                binding.input.gamepadAxisId,
                binding.input.gamepadButtonId,
                binding.output.hubId,
                binding.output.portId,
                binding.output.operationMode,
                binding.output.configuration
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
    }

    public addBinding(): void {
        this.store.dispatch(GAMEPAD_ACTIONS.gamepadWaitForUserInput());
        this.actions.pipe(
            ofType(GAMEPAD_ACTIONS.gamepadUserInputReceived),
            takeUntil(this.onDestroy$),
            takeUntil(this.actions.pipe(ofType(GAMEPAD_ACTIONS.gamepadWaitForUserInputCancel))),
            take(1),
            concatLatestFrom(() => this.store.select(HUBS_SELECTORS.selectHubs).pipe()),
            concatLatestFrom(([ action, hubs ]) =>
                hubs.length === 1
                ? this.store.select(HUB_ATTACHED_IO_SELECTORS.selectIOsControllableByMethod(hubs[0].hubId, action.inputMethod))
                : of([])
            ),
        ).subscribe(([ [ action ], ios ]) => { // TODO: something is wrong here with nested arrays
            const io = ios[0];
            if (!io) {
                return; // TODO: notify on no matching IO
            }
            const binging = this.controlSchemeFormFactoryService.createBindingForm(
                this.window.crypto.randomUUID(),
                action.gamepadId,
                action.inputMethod,
                action.gamepadAxisId,
                action.gamepadButtonId,
                ios[0].ioConfig.hubId,
                ios[0].ioConfig.portId,
                ios[0].operationModes[0]
            );
            this.form.controls.bindings.push(binging);
        });
    }

    public removeBindingIndex(index: number): void {
        this.form.controls.bindings.removeAt(index);
    }

    public cancelAddBinging(): void {
        this.store.dispatch(GAMEPAD_ACTIONS.gamepadWaitForUserInputCancel());
    }
}
