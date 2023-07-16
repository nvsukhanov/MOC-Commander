import { inject } from '@angular/core';
import { Actions, FunctionalEffect, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Observable, filter, from, fromEvent, interval, map, switchMap } from 'rxjs';
import { Store } from '@ngrx/store';

import { CONTROLLERS_ACTIONS } from '../../actions';
import { CONTROLLER_SELECTORS } from '../../selectors';
import { ControllerProfileFactoryService } from '../../../plugins';
import { APP_CONFIG, ControllerType, IAppConfig, WINDOW } from '@app/shared';
import { controllerIdFn } from '../../reducers';

const GAMEPAD_DISCONNECT_EVENT = 'gamepaddisconnected';

export const GAMEPAD_CONTROLLER_EFFECTS: Record<string, FunctionalEffect> = {
    waitForConnect: createEffect((
        actions$: Actions = inject(Actions),
        store: Store = inject(Store),
        window: Window = inject(WINDOW),
        controllerProfileFactory: ControllerProfileFactoryService = inject(ControllerProfileFactoryService),
        config: IAppConfig = inject(APP_CONFIG),
    ) => {
        return actions$.pipe(
            ofType(CONTROLLERS_ACTIONS.waitForConnect),
            switchMap(() => interval(config.gamepadConnectionReadInterval)),
            map(() => {
                const gamepads = window.navigator.getGamepads().filter((d) => !!d) as Gamepad[];
                return gamepads.filter((gamepad) => {
                    return gamepad.axes.some((a) => a > 0.5) || gamepad.buttons.some((b) => b.value > 0.5);
                });
            }),
            filter((r) => r.length > 0),
            concatLatestFrom(() => store.select(CONTROLLER_SELECTORS.selectGamepads)),
            map(([ browserGamepads, knownGamepads ]) => {
                const knownGamepadIds = new Set(knownGamepads.map((g) => g.gamepadIndex));
                return browserGamepads.filter((g) => !knownGamepadIds.has(g.index));
            }),
            switchMap((gamepads) => from(gamepads)),
            map((gamepad: Gamepad) => {
                const gamepadProfile = controllerProfileFactory.getProfile(ControllerType.Gamepad, gamepad.id);
                return CONTROLLERS_ACTIONS.connected({
                    id: gamepad.id,
                    gamepadIndex: gamepad.index,
                    controllerType: ControllerType.Gamepad,
                    triggerButtonIndices: [ ...gamepadProfile.triggerButtonIndices ],
                    buttonsCount: gamepad.buttons.length,
                    axesCount: gamepad.axes.length,
                });
            })
        );
    }, { functional: true }),
    listenGamepadDisconnect: createEffect((
        window: Window = inject(WINDOW),
        store: Store = inject(Store),
    ) => {
        return (fromEvent(window, GAMEPAD_DISCONNECT_EVENT) as Observable<GamepadEvent>).pipe(
            map((gamepadEvent) => gamepadEvent.gamepad),
            concatLatestFrom((gamepad) => store.select(CONTROLLER_SELECTORS.selectById(controllerIdFn({
                id: gamepad.id,
                controllerType: ControllerType.Gamepad,
                gamepadIndex: gamepad.index
            })))),
            filter(([ , controller ]) => !!controller),
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            map(([ , controller ]) => CONTROLLERS_ACTIONS.disconnected(controller!))
        );
    }, { functional: true })
};
