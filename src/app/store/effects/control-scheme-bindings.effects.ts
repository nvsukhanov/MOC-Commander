import { Injectable } from '@angular/core';
import { CONTROL_SCHEME_BINDINGS_ACTIONS, GAMEPAD_ACTIONS } from '../actions';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { filter, map, merge, skipUntil, switchMap, takeUntil } from 'rxjs';
import { GAMEPAD_AXES_STATE_SELECTORS, GAMEPAD_BUTTONS_STATE_SELECTORS } from '../selectors';
import { Store } from '@ngrx/store';
import { GamepadInputMethod } from '../i-state';

@Injectable()
export class ControlSchemeBindingsEffects {
    public readonly listenForGamepadEvents$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(CONTROL_SCHEME_BINDINGS_ACTIONS.gamepadInputListen),
            switchMap((action) => merge(
                this.store.select(GAMEPAD_AXES_STATE_SELECTORS.selectAll).pipe(
                    skipUntil(this.actions$.pipe(ofType(GAMEPAD_ACTIONS.updateGamepadsValues))),
                    takeUntil(this.actions$.pipe(
                        ofType(CONTROL_SCHEME_BINDINGS_ACTIONS.gamepadInputStopListening, CONTROL_SCHEME_BINDINGS_ACTIONS.gamepadInputReceived))
                    ),
                    map((gamepadAxesStates) => gamepadAxesStates.find((s) => Math.abs(s.value) > 0.9)),
                    filter((gamepadAxisState) => gamepadAxisState !== undefined),
                    map((gamepadAxisState) => CONTROL_SCHEME_BINDINGS_ACTIONS.gamepadInputReceived({
                            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                            gamepadId: gamepadAxisState!.gamepadIndex,
                            inputMethod: GamepadInputMethod.Axis,
                            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                            gamepadAxisId: gamepadAxisState!.axisIndex,
                            gamepadButtonId: null,
                        })
                    )
                ),
                this.store.select(GAMEPAD_BUTTONS_STATE_SELECTORS.selectAll).pipe(
                    skipUntil(this.actions$.pipe(ofType(GAMEPAD_ACTIONS.updateGamepadsValues))),
                    takeUntil(this.actions$.pipe(
                        ofType(CONTROL_SCHEME_BINDINGS_ACTIONS.gamepadInputStopListening, CONTROL_SCHEME_BINDINGS_ACTIONS.gamepadInputReceived))
                    ),
                    map((gamepadButtonsStates) => gamepadButtonsStates.find((s) => Math.abs(s.value) > 0.9)),
                    filter((gamepadButtonsStates) => gamepadButtonsStates !== undefined),
                    map((gamepadButtonsStates) => CONTROL_SCHEME_BINDINGS_ACTIONS.gamepadInputReceived({
                            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                            gamepadId: gamepadButtonsStates!.gamepadIndex,
                            inputMethod: GamepadInputMethod.Button,
                            gamepadAxisId: null,
                            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                            gamepadButtonId: gamepadButtonsStates!.buttonIndex,
                        })
                    )
                ),
            )));
    });

    constructor(
        private readonly actions$: Actions,
        private readonly store: Store,
    ) {
    }
}
