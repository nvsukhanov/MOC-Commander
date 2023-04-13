import { Inject, Injectable } from '@angular/core';
import { GamepadAxisState, GamepadButtonState } from '../i-state';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { CONTROL_SCHEME_BINDINGS_ACTIONS, GAMEPAD_ACTIONS } from '../actions';
import { animationFrames, fromEvent, map, Observable, switchMap, takeUntil } from 'rxjs';
import { WINDOW } from '../../types';
import { GamepadPluginsService } from '../../plugins';

@Injectable()
export class GamepadEffects {
    public readonly gamepadDisconnectedEvent = 'gamepaddisconnected';

    public readonly gamepadConnectedEvent = 'gamepadconnected';

    public readonly listenGamepadConnected$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(GAMEPAD_ACTIONS.listenGamepadConnected),
            switchMap(() => (fromEvent(this.window, this.gamepadConnectedEvent) as Observable<GamepadEvent>)),
            map((gamepadEvent) => this.gamepadPlugins.getPlugin(gamepadEvent.gamepad.id).mapToDefaultConfig(gamepadEvent.gamepad)),
            map((gamepad) => GAMEPAD_ACTIONS.gamepadConnected({ gamepad: gamepad }))
        );
    });

    public readonly listenGamepadDisconnected$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(GAMEPAD_ACTIONS.listenGamepadConnected),
            switchMap(() => (fromEvent(this.window, this.gamepadDisconnectedEvent) as Observable<GamepadEvent>)),
            map((gamepadEvent) => GAMEPAD_ACTIONS.gamepadDisconnected({ gamepadIndex: gamepadEvent.gamepad.index }))
        );
    });

    public readonly readGamepads$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(GAMEPAD_ACTIONS.gamepadsReadStart, CONTROL_SCHEME_BINDINGS_ACTIONS.gamepadInputListen),
            switchMap(() => animationFrames().pipe(
                takeUntil(this.actions$.pipe(ofType(
                    GAMEPAD_ACTIONS.gamepadsReadStop,
                    CONTROL_SCHEME_BINDINGS_ACTIONS.gamepadInputStopListening,
                    CONTROL_SCHEME_BINDINGS_ACTIONS.gamepadInputReceived
                )))
            )),
            map(() => {
                const gamepads = this.window.navigator.getGamepads().filter((d) => !!d) as Gamepad[];
                const axesState: GamepadAxisState[] = [];
                const buttonsState: GamepadButtonState[] = [];
                gamepads.forEach((gamepad) => {
                    gamepad.axes.forEach((axis, axisIndex) => {
                        axesState.push({ gamepadIndex: gamepad.index, axisIndex: axisIndex, value: axis });
                    });
                    gamepad.buttons.forEach((button, buttonIndex) => {
                        buttonsState.push({ gamepadIndex: gamepad.index, buttonIndex: buttonIndex, value: button.value });
                    });
                });
                return GAMEPAD_ACTIONS.updateGamepadsValues({ axesState: axesState, buttonsState: buttonsState });
            })
        );
    });

    constructor(
        private readonly actions$: Actions,
        @Inject(WINDOW) private readonly window: Window,
        private readonly gamepadPlugins: GamepadPluginsService
    ) {
    }
}
