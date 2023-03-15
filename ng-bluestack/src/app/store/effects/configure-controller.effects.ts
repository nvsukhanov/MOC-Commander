import { Inject, Injectable, InjectionToken } from '@angular/core';
import { GamepadControllerConfig, IState } from '../i-state';
import { Store } from '@ngrx/store';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ACTION_CONTROLLER_READ, ACTIONS_CONFIGURE_CONTROLLER } from '../actions';
import { animationFrameScheduler, filter, fromEvent, interval, map, Observable, switchMap, takeUntil, tap, withLatestFrom } from 'rxjs';
import { ControllerAxisState, ControllerButtonState, ExtractTokenType, WINDOW } from '../../types';
import { SELECTED_GAMEPAD_INDEX } from '../controller-selectors';

export interface IGamepadMapper {
    mapGamepadToConfig(gamepad: Gamepad): GamepadControllerConfig | null;
}

export const GAMEPAD_MAPPER = new InjectionToken<IGamepadMapper>('GAMEPAD_MAPPER');

@Injectable()
export class ConfigureControllerEffects {
    public readonly readGamepad$ = createEffect(() => this.actions$.pipe(
        ofType(ACTIONS_CONFIGURE_CONTROLLER.gamepadConnected),
        switchMap(() => interval(0, animationFrameScheduler)),
        takeUntil(this.actions$.pipe(ofType(ACTIONS_CONFIGURE_CONTROLLER.disconnectGamepad))),
        withLatestFrom(this.store.select(SELECTED_GAMEPAD_INDEX)),
        filter(([ , index ]) => index !== null),
        map(([ , index ]) => {
            const gamepad = this.window.navigator.getGamepads()[index as number]; // TODO: get rid of null & remove casts
            if (!gamepad) {
                return ACTIONS_CONFIGURE_CONTROLLER.disconnectGamepad({ index: index as number });
            }
            const buttons: ControllerButtonState[] = gamepad.buttons.map((button, index) => ({ type: 'button', value: button.value, index }));
            const axes: ControllerAxisState[] = gamepad.axes.map((value, index) => ({ type: 'axis', value, index }));
            return ACTION_CONTROLLER_READ({ state: [ ...buttons, ...axes ] });
        })
    ));

    private readonly gamepadConnectedEvent = 'gamepadconnected';

    public readonly startGamepadListening$ = createEffect(() => this.actions$.pipe(
        ofType(ACTIONS_CONFIGURE_CONTROLLER.listenForGamepad),
        switchMap(() => fromEvent(this.window, this.gamepadConnectedEvent) as Observable<GamepadEvent>),
        takeUntil(this.actions$.pipe(ofType(ACTIONS_CONFIGURE_CONTROLLER.cancelListeningForGamepad))),
        map((e) => {
            for (const mapper of this.gamepadMappers) {
                const result = mapper.mapGamepadToConfig(e.gamepad);
                if (result) {
                    return result;
                }
            }
            throw new Error(`unsupported gamepad ${e.gamepad.id}`);
        }),
        map((gamepad) => ACTIONS_CONFIGURE_CONTROLLER.gamepadConnected({ gamepad })) // TODO: handle error
    ));

    constructor(
        private readonly actions$: Actions,
        private readonly store: Store<IState>,
        @Inject(WINDOW) private readonly window: Window,
        @Inject(GAMEPAD_MAPPER) private gamepadMappers: ReadonlyArray<ExtractTokenType<typeof GAMEPAD_MAPPER>>
    ) {
    }
}
