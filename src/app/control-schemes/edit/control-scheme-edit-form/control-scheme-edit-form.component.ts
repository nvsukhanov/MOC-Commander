import { ChangeDetectionStrategy, Component, EventEmitter, Inject, Input, OnDestroy, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CONTROL_SCHEME_CONFIGURATION_STATE_SELECTORS, ControlScheme, GAMEPAD_ACTIONS, HUB_ATTACHED_IO_SELECTORS, HUBS_SELECTORS } from '../../../store';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { JsonPipe, NgForOf, NgIf } from '@angular/common';
import { PushModule } from '@ngrx/component';
import { TranslocoModule } from '@ngneat/transloco';
import { Store } from '@ngrx/store';
import { of, Subject, take, takeUntil } from 'rxjs';
import { Actions, concatLatestFrom, ofType } from '@ngrx/effects';
import {
    ControlSchemeBindingInputComponent,
    ControlSchemeBindingInputControl
} from '../../control-scheme-binding-input/control-scheme-binding-input.component';
import { ControlSchemeBindingOutputComponent, ControlSchemeBindingOutputControl } from '../../control-scheme-binding-output';
import { MatExpansionModule } from '@angular/material/expansion';
import { WINDOW } from '../../../types';
import { MatInputModule } from '@angular/material/input';

export type BindingFormResult = ReturnType<EditSchemeForm['getRawValue']>;

type BindingForm = FormGroup<{
    id: FormControl<string>,
    input: ControlSchemeBindingInputControl,
    output: ControlSchemeBindingOutputControl
}>;

type EditSchemeForm = FormGroup<{
    name: FormControl<string>,
    bindings: FormArray<BindingForm>
}>;

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
        ReactiveFormsModule
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ControlSchemeEditFormComponent implements OnDestroy {
    @Output() public readonly save = new EventEmitter<BindingFormResult>();

    public readonly form: EditSchemeForm = this.formBuilder.group({
        name: this.formBuilder.control<string>('', [ Validators.required ]) as FormControl<string>,
        bindings: this.formBuilder.array<BindingForm>([], Validators.required)
    });

    public readonly canAddBinding$ = this.store.select(CONTROL_SCHEME_CONFIGURATION_STATE_SELECTORS.canAddBinding);

    public readonly canCancelBinding$ = this.store.select(CONTROL_SCHEME_CONFIGURATION_STATE_SELECTORS.canCancelBinding);

    private readonly onDestroy$ = new Subject<void>();

    constructor(
        private readonly formBuilder: FormBuilder,
        private readonly store: Store,
        private readonly actions: Actions,
        @Inject(WINDOW) private readonly window: Window
    ) {
    }

    @Input()
    public set scheme(scheme: ControlScheme) {
        this.form.patchValue(scheme);
        this.form.markAsPristine();
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
        ).subscribe(([ [ action ], ios ]) => { // TODO: something is really wrong here
            const io = ios[0];
            if (!io) {
                return; // TODO: notify on no matching IO
            }
            const binging: BindingForm = this.formBuilder.group({
                id: this.formBuilder.control(this.window.crypto.randomUUID(), { nonNullable: true }),
                input: this.formBuilder.group({
                    gamepadId: this.formBuilder.control(action.gamepadId, { nonNullable: true, validators: [ Validators.required ] }),
                    gamepadInputMethod: this.formBuilder.control(action.inputMethod, { nonNullable: true, validators: [ Validators.required ] }),
                    gamepadAxisId: this.formBuilder.control(action.gamepadAxisId ?? null),
                    gamepadButtonId: this.formBuilder.control(action.gamepadButtonId ?? null),
                }),
                output: this.formBuilder.group({
                    hubId: this.formBuilder.control(io.ioConfig.hubId, { nonNullable: true, validators: [ Validators.required ] }),
                    portId: this.formBuilder.control(io.ioConfig.portId, { nonNullable: true, validators: [ Validators.required ] }),
                    operationMode: this.formBuilder.control(io.operationModes[0], { nonNullable: true, validators: [ Validators.required ] }),
                })
            });
            this.form.controls.bindings.push(binging);
        });
    }

    public cancelAddBinging(): void {
        this.store.dispatch(GAMEPAD_ACTIONS.gamepadWaitForUserInputCancel());
    }

    public onSave(): void {
        this.save.emit(this.form.getRawValue());
    }
}
