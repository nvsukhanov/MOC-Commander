import { concatLatestFrom, createEffect } from '@ngrx/effects';
import { NEVER, Observable, distinctUntilChanged, filter, from, interval, map, merge, share, startWith, switchMap } from 'rxjs';
import { Action, Store } from '@ngrx/store';
import { inject } from '@angular/core';
import { ControllerInputType, ControllerType, GamepadValueTransformService, WINDOW } from '@app/shared';

import { CONTROLLER_CONNECTION_SELECTORS, CONTROLLER_INPUT_SELECTORS } from '../../../selectors';
import { CONTROLLER_INPUT_ACTIONS } from '../../../actions';
import { controllerInputIdFn } from '../../../reducers';

function readGamepads(
    store: Store,
    navigator: Navigator,
    valueTransformer: GamepadValueTransformService
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
            const gamepadRead$ = createGamepadScheduler().pipe(
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
                    map((data) => valueTransformer.trimValue(data.axes[axisIndex])),
                    startWith(valueTransformer.trimValue(axisValue)),
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
                    map((apiGamepad) => valueTransformer.trimValue(apiGamepad.buttons[buttonIndex].value)),
                    startWith(valueTransformer.trimValue(browserGamepad.buttons[buttonIndex].value)),
                    distinctUntilChanged(),
                    concatLatestFrom(() => store.select(CONTROLLER_INPUT_SELECTORS.selectValueById(inputId))),
                    filter(([ currentValue, previousValue ]) => currentValue !== previousValue),
                    map(([ value, prevValue ]) => CONTROLLER_INPUT_ACTIONS.inputReceived({
                        nextState: {
                            controllerId: connection.controllerId,
                            inputType,
                            inputId: buttonIndex.toString(),
                            value,
                            rawValue: value,
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

function createGamepadScheduler(): Observable<unknown> {
    return interval(1000 / 30);
}

export const CAPTURE_GAMEPAD_INPUT = createEffect((
    store: Store = inject(Store),
    window: Window = inject(WINDOW),
    valueTransformer: GamepadValueTransformService = inject(GamepadValueTransformService)
) => {
    return store.select(CONTROLLER_INPUT_SELECTORS.isCapturing).pipe(
        switchMap((isCapturing) => isCapturing
                                   ? readGamepads(store, window.navigator, valueTransformer)
                                   : NEVER
        )
    );
}, { functional: true });

