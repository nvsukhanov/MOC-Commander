import { concatLatestFrom, createEffect } from '@ngrx/effects';
import { NEVER, Observable, animationFrames, distinctUntilChanged, map, merge, share, switchMap } from 'rxjs';
import { Action, Store } from '@ngrx/store';
import { inject } from '@angular/core';
import { ControllerInputType, ControllerType, GamepadSettings, GamepadValueTransformService } from '@app/controller-profiles';
import { WINDOW } from '@app/shared-misc';

import { GamepadControllerModel } from '../../../models';
import { CONTROLLER_CONNECTION_SELECTORS, CONTROLLER_INPUT_SELECTORS } from '../../../selectors';
import { CONTROLLER_INPUT_ACTIONS } from '../../../actions';
import { controllerInputIdFn } from '../../../reducers';

function createAxisChangesActions(
    gamepadRead$: Observable<Gamepad | null>,
    valueTransformer: GamepadValueTransformService,
    settings: GamepadSettings,
    store: Store,
    gamepadStoreModel: GamepadControllerModel
): Array<Observable<Action>> {
    const result = new Array<Observable<Action>>(gamepadStoreModel.axesCount);
    for (let axisIndex = 0; axisIndex < gamepadStoreModel.axesCount; axisIndex++) {
        if (settings.axisConfigs[axisIndex]?.ignoreInput) {
            result[axisIndex] = NEVER;
            continue;
        }
        const inputId = controllerInputIdFn({
            controllerId: gamepadStoreModel.id,
            inputId: axisIndex.toString(),
            inputType: ControllerInputType.Axis
        });
        result[axisIndex] = gamepadRead$.pipe(
            map((gamepad) => gamepad?.axes[axisIndex] ?? 0),
            distinctUntilChanged(),
            map((rawValue) => ({
                rawValue,
                value: valueTransformer.transformAxisRawValue(rawValue, settings.axisConfigs[axisIndex])
            })),
            distinctUntilChanged((a, b) => a.value === b.value),
            concatLatestFrom(() => store.select(CONTROLLER_INPUT_SELECTORS.selectValueById(inputId))),
            map(([ { rawValue, value }, prevValue ]) => CONTROLLER_INPUT_ACTIONS.inputReceived({
                nextState: {
                    controllerId: gamepadStoreModel.id,
                    inputType: ControllerInputType.Axis,
                    inputId: axisIndex.toString(),
                    value,
                    rawValue,
                    isActivated: valueTransformer.isAxisActivationThresholdReached(rawValue, settings.axisConfigs[axisIndex]),
                    timestamp: Date.now()
                },
                prevValue
            }))
        );
    }
    return result;
}

function createButtonChangesActions(
    gamepadRead$: Observable<Gamepad | null>,
    valueTransformer: GamepadValueTransformService,
    settings: GamepadSettings,
    store: Store,
    gamepadStoreModel: GamepadControllerModel
): Array<Observable<Action>> {
    const result = new Array<Observable<Action>>(gamepadStoreModel.buttonsCount);
    for (let buttonIndex = 0; buttonIndex < gamepadStoreModel.buttonsCount; buttonIndex++) {
        if (settings.buttonConfigs[buttonIndex]?.ignoreInput) {
            result[buttonIndex] = NEVER;
            continue;
        }
        const inputType = gamepadStoreModel.triggerButtonIndices.includes(buttonIndex) ? ControllerInputType.Trigger : ControllerInputType.Button;
        const inputId = controllerInputIdFn({
            controllerId: gamepadStoreModel.id,
            inputId: buttonIndex.toString(),
            inputType
        });
        result[buttonIndex] = gamepadRead$.pipe(
            map((gamepad) => gamepad?.buttons[buttonIndex]?.value ?? 0),
            distinctUntilChanged(),
            map((rawValue) => ({
                rawValue,
                value: valueTransformer.transformButtonRawValue(rawValue, settings.buttonConfigs[buttonIndex])
            })),
            distinctUntilChanged((a, b) => a.value === b.value),
            concatLatestFrom(() => store.select(CONTROLLER_INPUT_SELECTORS.selectValueById(inputId))),
            map(([ { rawValue, value }, prevValue ]) => CONTROLLER_INPUT_ACTIONS.inputReceived({
                nextState: {
                    controllerId: gamepadStoreModel.id,
                    inputType,
                    inputId: buttonIndex.toString(),
                    value,
                    rawValue,
                    isActivated: valueTransformer.isButtonActivationThresholdReached(rawValue, settings.buttonConfigs[buttonIndex]),
                    timestamp: Date.now()
                },
                prevValue
            }))
        );
    }
    return result;
}

function readGamepads(
    store: Store,
    navigator: Navigator,
    valueTransformer: GamepadValueTransformService
): Observable<Action> {
    const gamepadsRead$ = animationFrames().pipe(
        map(() => navigator.getGamepads()),
        share()
    );

    return store.select(CONTROLLER_CONNECTION_SELECTORS.selectGamepadConnections).pipe(
        switchMap((connectedGamepads) => {
            if (connectedGamepads.length === 0) {
                return NEVER;
            }
            return merge(
                ...connectedGamepads.map(({ connection, storeGamepad, settings }) => {
                    if (!storeGamepad
                        || storeGamepad.controllerType !== ControllerType.Gamepad
                        || settings?.controllerType !== ControllerType.Gamepad
                        || settings.ignoreInput
                    ) {
                        return NEVER;
                    }
                    const gamepadRead$ = gamepadsRead$.pipe(
                        map((gamepads) => gamepads[connection.gamepadIndex]),
                        share()
                    );

                    const axesChanges = createAxisChangesActions(gamepadRead$, valueTransformer, settings, store, storeGamepad);
                    const buttonChanges = createButtonChangesActions(gamepadRead$, valueTransformer, settings, store, storeGamepad);

                    return merge(...axesChanges, ...buttonChanges);
                })
            );
        })
    );
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
