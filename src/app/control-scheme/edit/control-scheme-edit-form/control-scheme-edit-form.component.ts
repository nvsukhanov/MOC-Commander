import { ChangeDetectionStrategy, Component, Input, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
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
        ControlSchemeBindingOutputComponent
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ControlSchemeEditFormComponent implements OnDestroy {
    public readonly form = this.formBuilder.group({
        schemeId: [ '' ],
        bindings: this.formBuilder.array<BindingForm>([])
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
            schemeId: scheme.schemeId,
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
                    portModeId: binding.output.portModeId,

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
            concatLatestFrom(() => this.store.select(HUBS_SELECTORS.selectHubs)),
            concatLatestFrom(([ action, hubs ]) =>
                hubs.length === 1
                ? this.store.select(HUB_ATTACHED_IO_SELECTORS.selectFirstIOControllableByMethod(hubs[0].hubId, action.inputMethod))
                : of(undefined)
            ),
        ).subscribe(([ [ action, hubs ], ios ]) => { // TODO: something is really wrong here
            const binging: BindingForm = this.formBuilder.group({
                input: this.formBuilder.group({
                    gamepadId: this.formBuilder.control(action.gamepadId, { nonNullable: true }),
                    gamepadInputMethod: this.formBuilder.control(action.inputMethod, { nonNullable: true }),
                    gamepadAxisId: this.formBuilder.control(action.gamepadAxisId ?? 0, { nonNullable: true }),
                    gamepadButtonId: this.formBuilder.control(action.gamepadButtonId ?? 0, { nonNullable: true }),
                }),
                output: this.formBuilder.group({
                    hubId: this.formBuilder.control(hubs.length === 1 ? hubs[0].hubId : null),
                    portId: this.formBuilder.control(ios?.portId ?? null),
                    portModeId: this.formBuilder.control(ios?.portModeId ?? null),
                })
            });
            this.form.controls.bindings.push(binging);
        });
    }

    public cancelAddBinging(): void {
        this.store.dispatch(CONTROL_SCHEME_BINDINGS_ACTIONS.gamepadInputStopListening());
    }
}
