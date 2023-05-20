import { Inject, Injectable } from '@angular/core';
import { GamepadAxisState, GamepadButtonState, GamepadInputMethod } from '../i-state';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { GAMEPAD_ACTIONS } from '../actions';
import { filter, from, fromEvent, interval, map, merge, Observable, switchMap, takeUntil } from 'rxjs';
import { WINDOW } from '../../common';
import { Store } from '@ngrx/store';
import { GAMEPAD_AXES_STATE_SELECTORS, GAMEPAD_BUTTONS_STATE_SELECTORS, GAMEPAD_SELECTORS } from '../selectors';
import { GamepadPluginsService } from '../../plugins';

@Injectable()
export class GamepadEffects {

    public readonly gamepadDisconnectedEvent = 'gamepaddisconnected';

    public readonly gamepadConnectedEvent = 'gamepadconnected';

    public readonly listenGamepadConnected$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(GAMEPAD_ACTIONS.listenGamepadConnected),
            switchMap(() => this.gamepadConnectionListenerScheduler$),
            map(() => {
                const gamepads = this.window.navigator.getGamepads().filter((d) => !!d) as Gamepad[];
                return gamepads.filter((gamepad) => {
                    return gamepad.axes.some((a) => a > 0.5) || gamepad.buttons.some((b) => b.value > 0.5);
                });
            }),
            filter((r) => r.length > 0),
            concatLatestFrom(() => this.store.select(GAMEPAD_SELECTORS.selectIds)),
            map(([ gamepads, knownGamepadIds ]) => {
                return gamepads.filter((g) => !(knownGamepadIds as number[]).includes(g.index));
            }),
            switchMap((gamepads) => from(gamepads)),
            map((gamepad) => this.gamepadPlugins.getPlugin(gamepad.id).mapToDefaultConfig(gamepad)),
            map((gamepadConfig) => GAMEPAD_ACTIONS.gamepadConnected({ gamepad: gamepadConfig }))
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
            ofType(GAMEPAD_ACTIONS.gamepadConnected),
            concatLatestFrom(() => this.store.select(GAMEPAD_SELECTORS.selectAll)),
            switchMap(([ , gamepadConfigs ]) => this.gamepadReadScheduler$.pipe(
                map(() => gamepadConfigs.map((g) => g.gamepadIndex))
            )),
            map((gamepadIndices) => {
                const gamepads = this.window.navigator.getGamepads().filter((d) => !!d) as Gamepad[];
                const registeredGamepads = gamepads.filter((g) => gamepadIndices.includes(g.index));
                const axesState: GamepadAxisState[] = [];
                const buttonsState: GamepadButtonState[] = [];
                registeredGamepads.forEach((gamepad) => {
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

    private readonly gamepadReadScheduler$: Observable<unknown>;

    private readonly gamepadConnectionListenerScheduler$: Observable<unknown>;

    constructor(
        private readonly actions$: Actions,
        private readonly store: Store,
        @Inject(WINDOW) private readonly window: Window,
        private readonly gamepadPlugins: GamepadPluginsService
    ) {
        this.gamepadReadScheduler$ = interval(1000 / 10);
        this.gamepadConnectionListenerScheduler$ = interval(1000 / 10);
    }
}
