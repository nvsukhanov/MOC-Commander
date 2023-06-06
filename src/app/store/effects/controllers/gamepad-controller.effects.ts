import { Inject, Injectable } from '@angular/core';
import { Action, Store } from '@ngrx/store';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { MonoTypeOperatorFunction, NEVER, Observable, filter, from, fromEvent, interval, map, merge, share, switchMap } from 'rxjs';

import { APP_CONFIG, IAppConfig, WINDOW } from '@app/shared';
import { CONTROLLERS_ACTIONS, CONTROLLER_INPUT_ACTIONS } from '../../actions';
import { CONTROLLER_INPUT_CAPTURE_SELECTORS, CONTROLLER_INPUT_SELECTORS, CONTROLLER_SELECTORS } from '../../selectors';
import { controllerIdFn, controllerInputIdFn } from '../../entity-adapters';
import { ControllerPluginFactoryService, ControllerType } from '../../../plugins';
import { ControllerInputType } from '../../controller-input-type';

@Injectable()
export class GamepadControllerEffects {
    public readonly gamepadDisconnectedEvent = 'gamepaddisconnected';

    public readonly valueChangesThreshold = 0.05;

    public readonly axialDeadZone = 0.1;

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

    public readonly captureGamepadInput$ = createEffect(() => {
        return this.store.select(CONTROLLER_INPUT_CAPTURE_SELECTORS.isCapturing).pipe(
            switchMap((isCapturing) => isCapturing ? this.readGamepads() : NEVER)
        );
    });

    private readonly gamepadReadScheduler$: Observable<unknown>;

    private readonly gamepadConnectionListenerScheduler$: Observable<unknown>;

    constructor(
        private readonly actions$: Actions,
        private readonly store: Store,
        @Inject(WINDOW) private readonly window: Window,
        private readonly gamepadPluginService: ControllerPluginFactoryService,
        @Inject(APP_CONFIG) config: IAppConfig
    ) {
        this.gamepadReadScheduler$ = interval(config.gamepadReadInterval);
        this.gamepadConnectionListenerScheduler$ = interval(config.gamepadConnectionReadInterval);
    }

    private readGamepads(): Observable<Action> {
        return this.store.select(CONTROLLER_SELECTORS.selectGamepads).pipe(
            switchMap((gamepadConfigs) => from(gamepadConfigs)),
            map((gamepadConfig) => {
                const browserGamepad = this.window.navigator.getGamepads()[gamepadConfig.gamepadIndex] as Gamepad;
                const controllerId = controllerIdFn(gamepadConfig);
                const gamepadRead$ = this.gamepadReadScheduler$.pipe(
                    map(() => this.window.navigator.getGamepads()[gamepadConfig.gamepadIndex] as Gamepad),
                    share()
                );
                const axesChanges = browserGamepad.axes.map((axisValue, axisIndex) => {
                    const inputId = controllerInputIdFn({
                        controllerId: controllerId,
                        inputId: axisIndex.toString(),
                        inputType: ControllerInputType.Axis
                    });

                    return gamepadRead$.pipe(
                        map((gamepad) => this.trimValue(gamepad.axes[axisIndex])),
                        map((value) => this.snapAxisValueToDeadZone(value)),
                        concatLatestFrom(() => this.store.select(CONTROLLER_INPUT_SELECTORS.selectValueById(inputId))),
                        this.filterWithThreshold(),
                        map(([ value ]) => CONTROLLER_INPUT_ACTIONS.inputReceived({
                            controllerId: controllerIdFn(gamepadConfig),
                            inputType: ControllerInputType.Axis,
                            inputId: axisIndex.toString(),
                            value
                        }))
                    );
                });

                const buttonChanges = browserGamepad.buttons.map((_, buttonIndex) => {
                    const inputType = gamepadConfig.triggerButtonIndices.includes(buttonIndex) ? ControllerInputType.Trigger : ControllerInputType.Button;
                    const inputId = controllerInputIdFn({
                        controllerId: controllerId,
                        inputId: buttonIndex.toString(),
                        inputType
                    });
                    return gamepadRead$.pipe(
                        map((gamepad) => this.trimValue(gamepad.buttons[buttonIndex].value)),
                        concatLatestFrom(() => this.store.select(CONTROLLER_INPUT_SELECTORS.selectValueById(inputId))),
                        this.filterWithThreshold(),
                        map(([ value ]) => CONTROLLER_INPUT_ACTIONS.inputReceived({
                            controllerId: controllerId,
                            inputType,
                            inputId: buttonIndex.toString(),
                            value
                        }))
                    );
                });

                return [ ...axesChanges, ...buttonChanges ];
            }),
            switchMap((changes) => merge(...changes))
        );
    }

    private trimValue(
        value: number
    ): number {
        return Math.round(value * 100) / 100;
    }

    private snapAxisValueToDeadZone(
        value: number,
    ): number {
        return Math.abs(value) < this.axialDeadZone ? 0 : value;
    }

    private filterWithThreshold(): MonoTypeOperatorFunction<[ number, number ]> {
        return filter(([ currentValue, previousValue ]) =>
            previousValue === undefined || Math.abs(currentValue - previousValue) > this.valueChangesThreshold
        );
    }
}
