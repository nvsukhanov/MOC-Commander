import { Actions, createEffect, ofType } from '@ngrx/effects';
import { inject } from '@angular/core';
import { Action, Store } from '@ngrx/store';
import { Observable, animationFrames, filter, map, switchMap } from 'rxjs';
import { concatLatestFrom } from '@ngrx/operators';
import { ControllerType, GamepadProfileFactoryService, GamepadSettings, IControllerProfile } from '@app/controller-profiles';
import { WINDOW } from '@app/shared-misc';

import { CONTROLLER_CONNECTION_SELECTORS, CONTROLLER_SELECTORS } from '../../../selectors';
import { CONTROLLERS_ACTIONS } from '../../../actions';
import { controllerIdFn } from '../../../reducers';

const GAMEPAD_DETECTION_INPUT_THRESHOLD = 0.5;

export const LISTEN_GAMEPAD_CONNECT = createEffect(
  (
    actions$: Actions = inject(Actions),
    store: Store = inject(Store),
    window: Window = inject(WINDOW),
    gamepadProfileFactoryService: GamepadProfileFactoryService = inject(GamepadProfileFactoryService),
  ) => {
    return actions$.pipe(
      ofType(CONTROLLERS_ACTIONS.waitForConnect),
      switchMap(() => animationFrames()),
      map(() => window.navigator.getGamepads().filter((d) => !!d) as Gamepad[]),
      filter((r) => r.length > 0),
      map((gamepads) => {
        const profileCounts: { [profileUid in string]: number } = {};
        const result = new Array<{
          profile: IControllerProfile<GamepadSettings>;
          gamepad: Gamepad;
          gamepadOfTypeIndex: number;
          storeId: string;
        }>(gamepads.length);

        gamepads.forEach((gamepad, idx) => {
          const profile = gamepadProfileFactoryService.getGamepadProfile(gamepad);
          if (!profileCounts[profile.uid]) {
            profileCounts[profile.uid] = 0;
          }
          const gamepadOfTypeIndex = profileCounts[profile.uid]++;
          result[idx] = {
            gamepad: gamepad,
            profile: profile,
            gamepadOfTypeIndex,
            storeId: controllerIdFn({
              controllerType: ControllerType.Gamepad,
              profileUid: profile.uid,
              gamepadOfTypeIndex,
            }),
          };
        });
        return result;
      }),
      concatLatestFrom(() => store.select(CONTROLLER_CONNECTION_SELECTORS.selectEntities)),
      map(([gamepadData, connectionEntities]) =>
        gamepadData.filter(
          ({ gamepad, storeId }) =>
            !connectionEntities[storeId] &&
            (gamepad.axes.some((a) => Math.abs(a) > GAMEPAD_DETECTION_INPUT_THRESHOLD) ||
              gamepad.buttons.some((b) => b.value > GAMEPAD_DETECTION_INPUT_THRESHOLD)),
        ),
      ),
      filter((gamepadData) => gamepadData.length > 0),
      concatLatestFrom(() => store.select(CONTROLLER_SELECTORS.selectEntities)),
      map(([gamepadData, knownGamepadEntities]) => {
        return gamepadData.map(
          ({
            storeId,
            gamepad,
            profile,
            gamepadsApiProfileIndex,
          }: {
            storeId: string;
            gamepad: Gamepad;
            profile: IControllerProfile<GamepadSettings>;
            gamepadsApiProfileIndex: number;
          }) => {
            if (knownGamepadEntities[storeId]) {
              return CONTROLLERS_ACTIONS.gamepadConnected({
                id: storeId,
                gamepadApiIndex: gamepad.index,
                profileUid: profile.uid,
              });
            } else {
              return CONTROLLERS_ACTIONS.gamepadDiscovered({
                id: storeId,
                profileUid: profile.uid,
                axesCount: gamepad.axes.length,
                buttonsCount: gamepad.buttons.length,
                triggerButtonsIndices: [...profile.triggerButtonsIndices],
                gamepadApiIndex: gamepad.index,
                gamepadOfTypeIndex: gamepadsApiProfileIndex,
                defaultSettings: profile.getDefaultSettings(),
              });
            }
          },
        );
      }),
      map((actions: Array<Action | null>) => actions.filter((a) => !!a)),
      filter((actions) => actions.length > 0),
      switchMap((actions) => actions),
    ) as Observable<Action>;
  },
  { functional: true },
);
