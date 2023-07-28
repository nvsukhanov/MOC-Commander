import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { inject } from '@angular/core';
import { Action, Store } from '@ngrx/store';
import { Observable, filter, interval, map, switchMap } from 'rxjs';
import { APP_CONFIG, ControllerType, IAppConfig, WINDOW } from '@app/shared';
import { CONTROLLERS_ACTIONS, CONTROLLER_CONNECTION_SELECTORS, CONTROLLER_SELECTORS, controllerIdFn } from '@app/store';

import { ControllerProfileFactoryService, IControllerProfile } from '../../../controller-profiles';

const GAMEPAD_DETECTION_INPUT_THRESHOLD = 0.5;

export const LISTEN_GAMEPAD_CONNECT = createEffect((
    actions$: Actions = inject(Actions),
    store: Store = inject(Store),
    window: Window = inject(WINDOW),
    controllerProfileFactory: ControllerProfileFactoryService = inject(ControllerProfileFactoryService),
    config: IAppConfig = inject(APP_CONFIG),
) => {
    return actions$.pipe(
        ofType(CONTROLLERS_ACTIONS.waitForConnect),
        switchMap(() => interval(config.gamepadConnectionReadInterval)),
        map(() => window.navigator.getGamepads().filter((d) => !!d) as Gamepad[]),
        filter((r) => r.length > 0),
        map((gamepads) => {
            const profileCounts: { [profileUid in string]: number } = {};
            const result: Array<{
                profile: IControllerProfile;
                gamepad: Gamepad;
                hasInput: boolean;
                gamepadsApiProfileIndex: number;
                storeId: string;
            }> = [];
            gamepads.forEach((gamepad) => {
                const profile = controllerProfileFactory.getProfile(ControllerType.Gamepad, gamepad.id);
                const hasInput = gamepad.axes.some((a) => a > GAMEPAD_DETECTION_INPUT_THRESHOLD)
                    || gamepad.buttons.some((b) => b.value > GAMEPAD_DETECTION_INPUT_THRESHOLD);
                if (!profileCounts[profile.uid]) {
                    profileCounts[profile.uid] = 0;
                }
                result.push({
                    storeId: controllerIdFn({
                        controllerType: ControllerType.Gamepad,
                        profileUid: profile.uid,
                        gamepadOfTypeIndex: profileCounts[profile.uid],
                    }),
                    gamepad: gamepad,
                    profile: profile,
                    hasInput,
                    gamepadsApiProfileIndex: profileCounts[profile.uid]++,
                });
            });
            return result;
        }),
        concatLatestFrom(() => [
            store.select(CONTROLLER_SELECTORS.selectEntities),
            store.select(CONTROLLER_CONNECTION_SELECTORS.selectEntities)
        ]),
        filter(([ gamepadData ]) => gamepadData.some(({ hasInput }) => hasInput)),
        map(([ gamepadData, knownGamepadEntities, connectionEntities ]) => {
            return gamepadData.map((gamepadDatum) => {
                if (!gamepadDatum.hasInput) {
                    return null;
                }
                if (knownGamepadEntities[gamepadDatum.storeId] && !connectionEntities[gamepadDatum.storeId]) {
                    return CONTROLLERS_ACTIONS.gamepadConnected({
                        id: gamepadDatum.storeId,
                        gamepadApiIndex: gamepadDatum.gamepad.index,
                        profileUid: gamepadDatum.profile.uid
                    });
                }
                if (!knownGamepadEntities[gamepadDatum.storeId]) {
                    return CONTROLLERS_ACTIONS.gamepadDiscovered({
                        id: gamepadDatum.storeId,
                        profileUid: gamepadDatum.profile.uid,
                        axesCount: gamepadDatum.gamepad.axes.length,
                        buttonsCount: gamepadDatum.gamepad.buttons.length,
                        triggerButtonsIndices: [ ...gamepadDatum.profile.triggerButtonsIndices ],
                        gamepadApiIndex: gamepadDatum.gamepad.index,
                        gamepadOfTypeIndex: gamepadDatum.gamepadsApiProfileIndex,
                    });
                }
                return null;
            });
        }),
        map((actions: Array<Action | null>) => actions.filter((a) => !!a)),
        filter((actions) => actions.length > 0),
        switchMap((actions) => actions),
    ) as Observable<Action>;
}, { functional: true });
