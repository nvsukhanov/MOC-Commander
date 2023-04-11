import { Inject, Injectable } from '@angular/core';
import { GamepadAxisState, GamepadButtonState, IState } from '../i-state';
import { Store } from '@ngrx/store';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { GAMEPAD_ACTIONS } from '../actions';
import { animationFrameScheduler, fromEvent, interval, map, Observable, switchMap, tap } from 'rxjs';
import { WINDOW } from '../../types';
import { GamepadPluginsService } from '../../plugins';

@Injectable()
export class GamepadEffects {
    public readonly listenGamepadConnected$ = createEffect(() => this.actions$.pipe(
        ofType(GAMEPAD_ACTIONS.listenGamepadConnected),
        tap(() => {
            (fromEvent(this.window, this.gamepadConnectedEvent) as Observable<GamepadEvent>)
                .subscribe((gamepadEvent) => {
                    const gamepadConfig = this.gamepadPlugins.getPlugin(gamepadEvent.gamepad.id).mapToDefaultConfig(gamepadEvent.gamepad);
                    this.store.dispatch(GAMEPAD_ACTIONS.gamepadConnected({ gamepad: gamepadConfig }));
                });
            (fromEvent(this.window, this.gamepadDisconnectedEvent) as Observable<GamepadEvent>)
                .subscribe((gamepadEvent) => {
                    this.store.dispatch(GAMEPAD_ACTIONS.gamepadDisconnected({ gamepadIndex: gamepadEvent.gamepad.index }));
                });
        })
    ), { dispatch: false });

    public readonly readGamepad$ = createEffect(() => this.actions$.pipe(
        ofType(GAMEPAD_ACTIONS.gamepadConnected),
        switchMap(() => interval(0, animationFrameScheduler)),
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
    ));

    private readonly gamepadDisconnectedEvent = 'gamepaddisconnected';

    private readonly gamepadConnectedEvent = 'gamepadconnected';

    constructor(
        private readonly actions$: Actions,
        private readonly store: Store<IState>,
        @Inject(WINDOW) private readonly window: Window,
        private readonly gamepadPlugins: GamepadPluginsService
    ) {
    }
}
