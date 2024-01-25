import { concatLatestFrom, createEffect } from '@ngrx/effects';
import { NEVER, Observable, distinctUntilChanged, filter, from, interval, map, merge, share, startWith, switchMap } from 'rxjs';
import { Action, Store } from '@ngrx/store';
import { inject } from '@angular/core';
import { CONTROLLERS_CONFIG, ControllerInputType, ControllerType, GamepadValueTransformService, IControllersConfig } from '@app/controller-profiles';
import { WINDOW } from '@app/shared-misc';

import { CONTROLLER_CONNECTION_SELECTORS, CONTROLLER_INPUT_SELECTORS } from '../../../selectors';
import { CONTROLLER_INPUT_ACTIONS } from '../../../actions';
import { controllerInputIdFn } from '../../../reducers';

function readGamepads(
    store: Store,
    navigator: Navigator,
    valueTransformer: GamepadValueTransformService,
    config: IControllersConfig
): Observable<Action> {
    return store.select(CONTROLLER_CONNECTION_SELECTORS.selectGamepadConnections).pipe(
        switchMap((connectedGamepads) => from(connectedGamepads)),
        map(({ connection, gamepad, settings }) => {
            if (!gamepad
                || gamepad.controllerType !== ControllerType.Gamepad
                || settings?.controllerType !== ControllerType.Gamepad
                || settings.ignoreInput
            ) {
                return [ NEVER ];
            }
            const browserGamepad = navigator.getGamepads()[connection.gamepadIndex] as Gamepad;
            const gamepadRead$ = interval(config.gamepad.inputReadInterval).pipe(
                map(() => navigator.getGamepads()[connection.gamepadIndex] as Gamepad),
                share()
            );
            const axesChanges = browserGamepad.axes.map((axisValue, axisIndex) => {
                const inputId = controllerInputIdFn({
                    controllerId: connection.controllerId,
                    inputId: axisIndex.toString(),
                    inputType: ControllerInputType.Axis
                });

                return gamepadRead$.pipe(
                    filter((data): data is Gamepad => !!data),
                    map((data) => valueTransformer.transformAxisRawValue(data.axes[axisIndex], settings.axisConfigs[axisIndex])),
                    startWith(valueTransformer.transformAxisRawValue(axisValue, settings.axisConfigs[axisIndex])),
                    distinctUntilChanged(),
                    map((rawValue) => ({
                        rawValue,
                        value: valueTransformer.transformAxisValue(rawValue, settings.axisConfigs[axisIndex])
                    })),
                    concatLatestFrom(() => store.select(CONTROLLER_INPUT_SELECTORS.selectValueById(inputId))),
                    map(([ current, prevValue ]) => CONTROLLER_INPUT_ACTIONS.inputReceived({
                        nextState: {
                            controllerId: connection.controllerId,
                            inputType: ControllerInputType.Axis,
                            inputId: axisIndex.toString(),
                            value: current.value,
                            rawValue: current.rawValue,
                            isActivated: valueTransformer.isAxisActivationThresholdReached(current.rawValue, settings.axisConfigs[axisIndex]),
                            timestamp: Date.now()
                        },
                        prevValue
                    }))
                );
            });

            const buttonChanges = browserGamepad.buttons.map((_, buttonIndex) => {
                const inputType = gamepad.triggerButtonIndices.includes(buttonIndex) ? ControllerInputType.Trigger : ControllerInputType.Button;
                const inputId = controllerInputIdFn({
                    controllerId: connection.controllerId,
                    inputId: buttonIndex.toString(),
                    inputType
                });
                return gamepadRead$.pipe(
                    filter((data): data is Gamepad => !!data && !!data.buttons[buttonIndex]),
                    map((apiGamepad) => valueTransformer.transformButtonRawValue(apiGamepad.buttons[buttonIndex].value, settings.buttonConfigs[buttonIndex])),
                    startWith(valueTransformer.transformButtonRawValue(browserGamepad.buttons[buttonIndex].value, settings.buttonConfigs[buttonIndex])),
                    distinctUntilChanged(),
                    map((rawValue) => ({
                        rawValue,
                        value: valueTransformer.transformButtonValue(rawValue, settings.buttonConfigs[buttonIndex])
                    })),
                    concatLatestFrom(() => store.select(CONTROLLER_INPUT_SELECTORS.selectValueById(inputId))),
                    map(([ current, prevValue ]) => CONTROLLER_INPUT_ACTIONS.inputReceived({
                        nextState: {
                            controllerId: connection.controllerId,
                            inputType,
                            inputId: buttonIndex.toString(),
                            value: current.value,
                            rawValue: current.rawValue,
                            isActivated: valueTransformer.isButtonActivationThresholdReached(current.rawValue, settings.buttonConfigs[buttonIndex]),
                            timestamp: Date.now()
                        },
                        prevValue
                    }))
                );
            });

            return [ ...axesChanges, ...buttonChanges ];
        }),
        switchMap((changes) => merge(...changes))
    ) as Observable<Action>;
}

export const CAPTURE_GAMEPAD_INPUT = createEffect((
    store: Store = inject(Store),
    window: Window = inject(WINDOW),
    valueTransformer: GamepadValueTransformService = inject(GamepadValueTransformService),
    config: IControllersConfig = inject(CONTROLLERS_CONFIG)
) => {
    return store.select(CONTROLLER_INPUT_SELECTORS.isCapturing).pipe(
        switchMap((isCapturing) => isCapturing
                                   ? readGamepads(store, window.navigator, valueTransformer, config)
                                   : NEVER
        )
    );
}, { functional: true });

