import { Inject, Injectable } from '@angular/core';
import { Action, Store } from '@ngrx/store';
import { concatLatestFrom, createEffect } from '@ngrx/effects';
import { MonoTypeOperatorFunction, NEVER, Observable, filter, from, interval, map, merge, share, switchMap } from 'rxjs';

import { APP_CONFIG, ControllerInputType, IAppConfig, WINDOW } from '@app/shared';
import { CONTROLLER_SELECTORS, controllerIdFn } from '../controllers';
import { controllerInputIdFn } from './controller-input.reducer';
import { CONTROLLER_INPUT_ACTIONS } from './controller-input.actions';
import { CONTROLLER_INPUT_SELECTORS } from './controller-input.selectors';

@Injectable()
export class GamepadControllerInputEffects {

    public readonly valueChangesThreshold = 0.05;

    public readonly axialDeadZone = 0.1;

    public readonly captureGamepadInput$ = createEffect(() => {
        return this.store.select(CONTROLLER_INPUT_SELECTORS.isCapturing).pipe(
            switchMap((isCapturing) => isCapturing ? this.readGamepads() : NEVER)
        );
    });

    private readonly gamepadReadScheduler$: Observable<unknown>;

    constructor(
        private readonly store: Store,
        @Inject(WINDOW) private readonly window: Window,
        @Inject(APP_CONFIG) config: IAppConfig
    ) {
        this.gamepadReadScheduler$ = interval(config.gamepadReadInterval);
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
