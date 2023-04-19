import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
    CONTROL_SCHEME_BINDINGS_ACTIONS,
    CONTROL_SCHEME_CONFIGURATION_STATE_SELECTORS,
    ControlSchemeEditState,
    HUB_ATTACHED_IO_SELECTORS,
    HUBS_SELECTORS
} from '../../../store';
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

type BindingForm = FormGroup<{
    input: ControlSchemeBindingInputControl,
    output: ControlSchemeBindingOutputControl
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
        MatExpansionModule
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ControlSchemeEditFormComponent implements OnDestroy {
    @Output() public readonly save = new EventEmitter<ControlSchemeEditState>();

    public readonly form = this.formBuilder.group({
        schemeId: this.formBuilder.control<string | null>(null),
        bindings: this.formBuilder.array<BindingForm>([], Validators.required)
    });

    public readonly canAddBinding$ = this.store.select(CONTROL_SCHEME_CONFIGURATION_STATE_SELECTORS.canAddBinding);

    public readonly canCancelBinding$ = this.store.select(CONTROL_SCHEME_CONFIGURATION_STATE_SELECTORS.canCancelBinding);

    private readonly onDestroy$ = new Subject<void>();

    constructor(
        private readonly formBuilder: FormBuilder,
        private readonly store: Store,
        private readonly actions: Actions
    ) {
    }

    @Input()
    public set scheme(scheme: ControlSchemeEditState) {
        this.form.patchValue({
            schemeId: scheme.schemeId ?? null,
            bindings: scheme.bindings.map(binding => ({
                input: {
                    gamepadId: binding.input.gamepadId,
                    gamepadInputMethod: binding.input.gamepadInputMethod,
                    gamepadAxisId: binding.input.gamepadAxisId ?? 0,
                    gamepadButtonId: binding.input.gamepadButtonId ?? 0,
                },
                output: {
                    hubId: binding.output.hubId,
                    portId: binding.output.portId,
                    operationMode: binding.output.operationMode,
                }
            }))
        });
        this.form.markAsPristine();
    }

    public ngOnDestroy(): void {
        this.onDestroy$.next();
        this.onDestroy$.complete();
    }

    public addBinding(): void {
        this.store.dispatch(CONTROL_SCHEME_BINDINGS_ACTIONS.gamepadInputListen());
        this.actions.pipe(
            ofType(CONTROL_SCHEME_BINDINGS_ACTIONS.gamepadInputReceived),
            takeUntil(this.onDestroy$),
            takeUntil(this.actions.pipe(ofType(CONTROL_SCHEME_BINDINGS_ACTIONS.gamepadInputStopListening))),
            take(1),
            concatLatestFrom(() => this.store.select(HUBS_SELECTORS.selectHubs).pipe()),
            concatLatestFrom(([ action, hubs ]) =>
                hubs.length === 1
                ? this.store.select(HUB_ATTACHED_IO_SELECTORS.selectIOsControllableByMethod(hubs[0].hubId, action.inputMethod))
                : of([])
            ),
        ).subscribe(([ [ action, hubs ], ios ]) => { // TODO: something is really wrong here
            const binging: BindingForm = this.formBuilder.group({
                input: this.formBuilder.group({
                    gamepadId: this.formBuilder.control(action.gamepadId, { nonNullable: true, validators: [ Validators.required ] }),
                    gamepadInputMethod: this.formBuilder.control(action.inputMethod, { nonNullable: true, validators: [ Validators.required ] }),
                    gamepadAxisId: this.formBuilder.control(action.gamepadAxisId ?? 0, { nonNullable: true, validators: [ Validators.required ] }),
                    gamepadButtonId: this.formBuilder.control(action.gamepadButtonId ?? 0, { nonNullable: true, validators: [ Validators.required ] }),
                }),
                output: this.formBuilder.group({
                    hubId: this.formBuilder.control(hubs.length === 1 ? hubs[0].hubId : null, { validators: [ Validators.required ] }),
                    portId: this.formBuilder.control(ios[0]?.ioConfig.portId ?? null, { validators: [ Validators.required ] }),
                    operationMode: this.formBuilder.control(ios[0]?.operationModes[0] ?? null, { validators: [ Validators.required ] }),
                })
            });
            this.form.controls.bindings.push(binging);
        });
    }

    public cancelAddBinging(): void {
        this.store.dispatch(CONTROL_SCHEME_BINDINGS_ACTIONS.gamepadInputStopListening());
    }

    public onSave(): void {
        this.save.emit(this.form.value as ControlSchemeEditState);
    }
}
