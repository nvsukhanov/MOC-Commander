import { Inject, Injectable, InjectionToken } from '@angular/core';
import { GamepadControllerConfig, IState } from '../i-state';
import { Store } from '@ngrx/store';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ACTIONS_CONFIGURE_CONTROLLER } from '../actions';
import { fromEvent, map, Observable, switchMap, takeUntil } from 'rxjs';
import { ExtractTokenType, WINDOW } from '../../types';

export interface IGamepadMapper {
    mapGamepadToConfig(gamepad: Gamepad): GamepadControllerConfig | null;
}

export const GAMEPAD_MAPPER = new InjectionToken<IGamepadMapper>('GAMEPAD_MAPPER');

@Injectable()
export class ConfigureControllerEffects {
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
