import { concatLatestFrom, createEffect } from '@ngrx/effects';
import { MonoTypeOperatorFunction, NEVER, Observable, filter, from, interval, map, merge, share, switchMap } from 'rxjs';
import { Action, Store } from '@ngrx/store';
import { inject } from '@angular/core';
import { CONTROLLER_CONNECTION_SELECTORS, CONTROLLER_INPUT_ACTIONS, CONTROLLER_INPUT_SELECTORS, controllerInputIdFn } from '@app/store';
import { APP_CONFIG, ControllerInputType, IAppConfig, WINDOW } from '@app/shared';

const AXIAL_DEAD_ZONE = 0.1;
const VALUE_CHANGES_THRESHOLD = 0.05;

function readGamepads(
    store: Store,
    navigator: Navigator,
    config: IAppConfig
): Observable<Action> {
    return store.select(CONTROLLER_CONNECTION_SELECTORS.selectGamepadConnections).pipe(
        switchMap((connectedGamepads) => from(connectedGamepads)),
        map(({ connection, gamepad }) => {
            const browserGamepad = navigator.getGamepads()[connection.gamepadIndex] as Gamepad;
            const gamepadRead$ = createGamepadScheduler(config.gamepadReadInterval).pipe(
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
                    map((apiGamepad) => trimValue(apiGamepad.axes[axisIndex])),
                    map((value) => snapAxisValueToDeadZone(value)),
                    concatLatestFrom(() => store.select(CONTROLLER_INPUT_SELECTORS.selectValueById(inputId))),
                    filterWithThreshold(),
                    map(([ value ]) => CONTROLLER_INPUT_ACTIONS.inputReceived({
                        controllerId: connection.controllerId,
                        inputType: ControllerInputType.Axis,
                        inputId: axisIndex.toString(),
                        value
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
                    map((apiGamepad) => trimValue(apiGamepad.buttons[buttonIndex].value)),
                    concatLatestFrom(() => store.select(CONTROLLER_INPUT_SELECTORS.selectValueById(inputId))),
                    filterWithThreshold(),
                    map(([ value ]) => CONTROLLER_INPUT_ACTIONS.inputReceived({
                        controllerId: connection.controllerId,
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

function trimValue(
    value: number
): number {
    return Math.round(value * 100) / 100;
}

function snapAxisValueToDeadZone(
    value: number,
): number {
    return Math.abs(value) < AXIAL_DEAD_ZONE ? 0 : value;
}

function createGamepadScheduler(
    intervalMs: number
): Observable<unknown> {
    return interval(intervalMs);
}

function filterWithThreshold(): MonoTypeOperatorFunction<[ number, number ]> {
    return filter(([ currentValue, previousValue ]) =>
        previousValue === undefined || Math.abs(currentValue - previousValue) > VALUE_CHANGES_THRESHOLD
    );
}

export const CAPTURE_GAMEPAD_INPUT = createEffect((
    store: Store = inject(Store),
    window: Window = inject(WINDOW),
    config: IAppConfig = inject(APP_CONFIG)
) => {
    return store.select(CONTROLLER_INPUT_SELECTORS.isCapturing).pipe(
        switchMap((isCapturing) => isCapturing
                                   ? readGamepads(store, window.navigator, config)
                                   : NEVER
        )
    );
}, { functional: true });

