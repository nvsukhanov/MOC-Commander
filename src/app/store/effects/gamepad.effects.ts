import { Inject, Injectable } from '@angular/core';
import { GamepadAxisState, GamepadButtonState } from '../i-state';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { GAMEPAD_ACTIONS } from '../actions';
import { animationFrames, bufferCount, fromEvent, map, Observable, switchMap, takeUntil } from 'rxjs';
import { WINDOW } from '../../types';
import { GamepadPluginsService } from '../../plugins';
import { Store } from '@ngrx/store';
import { GAMEPAD_SELECTORS } from '../selectors';

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

    public readonly controlReadGamepads$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(GAMEPAD_ACTIONS.gamepadConnected, GAMEPAD_ACTIONS.gamepadDisconnected),
            concatLatestFrom(() => this.store.select(GAMEPAD_SELECTORS.selectAll)),
            map(([ , gamepads ]) => {
                return gamepads.length > 0
                       ? GAMEPAD_ACTIONS.gamepadsReadStart()
                       : GAMEPAD_ACTIONS.gamepadsReadStop();
            })
        );
    });

    public readonly readGamepads$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(GAMEPAD_ACTIONS.gamepadsReadStart),
            switchMap(() => animationFrames().pipe(
                bufferCount(this.readGamepadNthFrames),
                takeUntil(this.actions$.pipe(ofType(
                    GAMEPAD_ACTIONS.gamepadsReadStop,
                )))
            )),
            map(() => {
                const gamepads = this.window.navigator.getGamepads().filter((d) => !!d) as Gamepad[];
                const axesState: GamepadAxisState[] = [];
                const buttonsState: GamepadButtonState[] = [];
                gamepads.forEach((gamepad) => {
                    gamepad.axes.forEach((axis, axisIndex) => {
                        axesState.push({ gamepadIndex: gamepad.index, axisIndex: axisIndex, value: +axis.toFixed(this.inputValuePrecision) });
                    });
                    gamepad.buttons.forEach((button, buttonIndex) => {
                        buttonsState.push({ gamepadIndex: gamepad.index, buttonIndex: buttonIndex, value: +button.value.toFixed(this.inputValuePrecision) });
                    });
                });
                return GAMEPAD_ACTIONS.updateGamepadsValues({ axesState: axesState, buttonsState: buttonsState });
            })
        );
    });

    private readonly readGamepadNthFrames = 2; // TODO: move to config?

    private readonly inputValuePrecision = 2; // TODO: move to config?

    constructor(
        private readonly actions$: Actions,
        private readonly store: Store,
        @Inject(WINDOW) private readonly window: Window,
        private readonly gamepadPlugins: GamepadPluginsService
    ) {
    }
}
