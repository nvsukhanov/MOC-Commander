import { Inject, Injectable } from '@angular/core';
import { GamepadAxisState, GamepadButtonState, GamepadInputMethod } from '../i-state';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { GAMEPAD_ACTIONS } from '../actions';
import { filter, fromEvent, interval, map, merge, Observable, switchMap, takeUntil } from 'rxjs';
import { WINDOW } from '../../types';
import { GamepadPluginsService } from '../../plugins';
import { Store } from '@ngrx/store';
import { GAMEPAD_AXES_STATE_SELECTORS, GAMEPAD_BUTTONS_STATE_SELECTORS, GAMEPAD_SELECTORS } from '../selectors';

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
            switchMap(() => this.gamepadReadScheduler.pipe(
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

    public readonly listenForGamepadInput$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(GAMEPAD_ACTIONS.gamepadWaitForUserInput),
            switchMap(() => merge(
                this.store.select(GAMEPAD_AXES_STATE_SELECTORS.selectFistBinding).pipe(
                    filter((v) => !!v),
                    takeUntil(this.actions$.pipe(
                        ofType(GAMEPAD_ACTIONS.gamepadWaitForUserInputCancel, GAMEPAD_ACTIONS.gamepadUserInputReceived))
                    ),
                    map((gamepadAxisState) => GAMEPAD_ACTIONS.gamepadUserInputReceived({
                            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                            gamepadId: gamepadAxisState!.gamepadIndex,
                            inputMethod: GamepadInputMethod.Axis,
                            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                            gamepadAxisId: gamepadAxisState!.axisIndex,
                            gamepadButtonId: null,
                        })
                    )
                ),
                this.store.select(GAMEPAD_BUTTONS_STATE_SELECTORS.selectFistBinding).pipe(
                    filter((v) => !!v),
                    takeUntil(this.actions$.pipe(
                        ofType(GAMEPAD_ACTIONS.gamepadWaitForUserInputCancel, GAMEPAD_ACTIONS.gamepadUserInputReceived))
                    ),
                    map((gamepadButtonsStates) => GAMEPAD_ACTIONS.gamepadUserInputReceived({
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

    private readonly inputValuePrecision = 2; // TODO: move to config?

    private readonly gamepadReadScheduler: Observable<unknown>;

    constructor(
        private readonly actions$: Actions,
        private readonly store: Store,
        @Inject(WINDOW) private readonly window: Window,
        private readonly gamepadPlugins: GamepadPluginsService
    ) {
        this.gamepadReadScheduler = interval(1000 / 10);
    }
}
