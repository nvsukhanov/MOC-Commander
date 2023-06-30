import { Inject, Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Observable, filter, from, fromEvent, interval, map, switchMap } from 'rxjs';
import { Store } from '@ngrx/store';

import { CONTROLLERS_ACTIONS } from './controllers.actions';
import { CONTROLLER_SELECTORS } from './controllers.selectors';
import { ControllerPluginFactoryService } from '../../plugins';
import { APP_CONFIG, IAppConfig, WINDOW } from '@app/shared';
import { controllerIdFn } from './controllers.reducer';
import { ControllerType } from './controller-model';

@Injectable()
export class GamepadControllerEffects {
    public readonly gamepadDisconnectedEvent = 'gamepaddisconnected';

    public readonly waitForConnect$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(CONTROLLERS_ACTIONS.waitForConnect),
            switchMap(() => this.gamepadConnectionListenerScheduler$),
            map(() => {
                const gamepads = this.window.navigator.getGamepads().filter((d) => !!d) as Gamepad[];
                return gamepads.filter((gamepad) => {
                    return gamepad.axes.some((a) => a > 0.5) || gamepad.buttons.some((b) => b.value > 0.5);
                });
            }),
            filter((r) => r.length > 0),
            concatLatestFrom(() => this.store.select(CONTROLLER_SELECTORS.selectGamepads)),
            map(([ browserGamepads, knownGamepads ]) => {
                const knownGamepadIds = new Set(knownGamepads.map((g) => g.gamepadIndex));
                return browserGamepads.filter((g) => !knownGamepadIds.has(g.index));
            }),
            switchMap((gamepads) => from(gamepads)),
            map((gamepad: Gamepad) => {
                const gamepadPlugin = this.gamepadPluginService.getPlugin(ControllerType.Gamepad, gamepad.id);
                return CONTROLLERS_ACTIONS.connected({
                    id: gamepad.id,
                    gamepadIndex: gamepad.index,
                    controllerType: ControllerType.Gamepad,
                    triggerButtonIndices: [ ...gamepadPlugin.triggerButtonIndices ],
                    buttonsCount: gamepad.buttons.length,
                    axesCount: gamepad.axes.length,
                });
            })
        );
    });

    public readonly listenGamepadDisconnected$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(CONTROLLERS_ACTIONS.waitForConnect),
            switchMap(() => (fromEvent(this.window, this.gamepadDisconnectedEvent) as Observable<GamepadEvent>)),
            map((gamepadEvent) => gamepadEvent.gamepad),
            map((gamepad) => CONTROLLERS_ACTIONS.disconnected({
                id: controllerIdFn({ id: gamepad.id, controllerType: ControllerType.Gamepad, gamepadIndex: gamepad.index }),
            }))
        );
    });

    private readonly gamepadConnectionListenerScheduler$: Observable<unknown>;

    constructor(
        private actions$: Actions,
        @Inject(APP_CONFIG) config: IAppConfig,
        @Inject(WINDOW) private readonly window: Window,
        private readonly store: Store,
        private readonly gamepadPluginService: ControllerPluginFactoryService,
    ) {
        this.gamepadConnectionListenerScheduler$ = interval(config.gamepadConnectionReadInterval);
    }
}
