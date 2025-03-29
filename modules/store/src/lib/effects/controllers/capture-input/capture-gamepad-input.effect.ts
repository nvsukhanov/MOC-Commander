import { createEffect } from '@ngrx/effects';
import {
  NEVER,
  Observable,
  animationFrames,
  distinctUntilChanged,
  interval,
  map,
  merge,
  share,
  startWith,
  switchMap,
} from 'rxjs';
import { Action, Store } from '@ngrx/store';
import { inject } from '@angular/core';
import { ControllerInputType, ControllerType, GamepadSettings, transformRawInputValue } from '@app/controller-profiles';
import { WINDOW } from '@app/shared-misc';

import { SETTINGS_FEATURE } from '../../../reducers';
import { GamepadControllerModel, GamepadPollingRate } from '../../../models';
import { CONTROLLER_CONNECTION_SELECTORS, CONTROLLER_INPUT_SELECTORS } from '../../../selectors';
import { CONTROLLER_INPUT_ACTIONS } from '../../../actions';

function createAxisChangesActions(
  gamepadRead$: Observable<Gamepad | null>,
  settings: GamepadSettings,
  gamepadStoreModel: GamepadControllerModel,
): Array<Observable<Action>> {
  const result = new Array<Observable<Action>>(gamepadStoreModel.axesCount);
  for (let axisIndex = 0; axisIndex < gamepadStoreModel.axesCount; axisIndex++) {
    if (settings.axisConfigs[axisIndex]?.ignoreInput) {
      result[axisIndex] = NEVER;
      continue;
    }
    result[axisIndex] = gamepadRead$.pipe(
      map((gamepad) => (gamepad?.axes[axisIndex] ?? 0) + (settings.axisConfigs[axisIndex]?.trim ?? 0)),
      startWith(0),
      map((rawValue) => ({
        rawValue,
        value: transformRawInputValue(rawValue, settings.axisConfigs[axisIndex]),
      })),
      distinctUntilChanged((prev, curr) => prev.value === curr.value),
      map(({ rawValue }) =>
        CONTROLLER_INPUT_ACTIONS.inputReceived({
          nextState: {
            controllerId: gamepadStoreModel.id,
            inputType: ControllerInputType.Axis,
            inputId: axisIndex.toString(),
            rawValue,
            timestamp: Date.now(),
          },
        }),
      ),
    );
  }
  return result;
}

function createButtonChangesActions(
  gamepadRead$: Observable<Gamepad | null>,
  settings: GamepadSettings,
  gamepadStoreModel: GamepadControllerModel,
): Array<Observable<Action>> {
  const result = new Array<Observable<Action>>(gamepadStoreModel.buttonsCount);
  for (let buttonIndex = 0; buttonIndex < gamepadStoreModel.buttonsCount; buttonIndex++) {
    if (settings.buttonConfigs[buttonIndex]?.ignoreInput) {
      result[buttonIndex] = NEVER;
      continue;
    }
    const inputType = gamepadStoreModel.triggerButtonIndices.includes(buttonIndex)
      ? ControllerInputType.Trigger
      : ControllerInputType.Button;
    result[buttonIndex] = gamepadRead$.pipe(
      map((gamepad) => (gamepad?.buttons[buttonIndex]?.value ?? 0) + (settings.buttonConfigs[buttonIndex]?.trim ?? 0)),
      map((rawValue) => ({
        rawValue,
        value: transformRawInputValue(rawValue, settings.buttonConfigs[buttonIndex]),
      })),
      distinctUntilChanged((prev, curr) => prev.value === curr.value),
      map(({ rawValue }) =>
        CONTROLLER_INPUT_ACTIONS.inputReceived({
          nextState: {
            controllerId: gamepadStoreModel.id,
            inputType,
            inputId: buttonIndex.toString(),
            rawValue,
            timestamp: Date.now(),
          },
        }),
      ),
    );
  }
  return result;
}

const GAMEPAD_POLL_SCHEDULERS: { [k in GamepadPollingRate]: Observable<unknown> } = {
  [GamepadPollingRate.Low]: animationFrames(),
  [GamepadPollingRate.Default]: interval(),
};

function readGamepads(store: Store, navigator: Navigator): Observable<Action> {
  const gamepadsRead$ = store.select(SETTINGS_FEATURE.selectGamepadPollingRate).pipe(
    switchMap((pollingRate) => GAMEPAD_POLL_SCHEDULERS[pollingRate]),
    map(() => navigator.getGamepads()),
    share(),
  );

  return store.select(CONTROLLER_CONNECTION_SELECTORS.selectGamepadConnections).pipe(
    switchMap((connectedGamepads) => {
      if (connectedGamepads.length === 0) {
        return NEVER;
      }
      return merge(
        ...connectedGamepads.map(({ connection, storeGamepad, settings }) => {
          if (
            !storeGamepad ||
            storeGamepad.controllerType !== ControllerType.Gamepad ||
            settings?.controllerType !== ControllerType.Gamepad ||
            settings.ignoreInput
          ) {
            return NEVER;
          }
          const gamepadRead$ = gamepadsRead$.pipe(
            map((gamepads) => gamepads[connection.gamepadIndex]),
            share(),
          );

          const axesChanges = createAxisChangesActions(gamepadRead$, settings, storeGamepad);
          const buttonChanges = createButtonChangesActions(gamepadRead$, settings, storeGamepad);

          return merge(...axesChanges, ...buttonChanges);
        }),
      );
    }),
  );
}

export const CAPTURE_GAMEPAD_INPUT = createEffect(
  (store: Store = inject(Store), window: Window = inject(WINDOW)) => {
    return store
      .select(CONTROLLER_INPUT_SELECTORS.isCapturing)
      .pipe(switchMap((isCapturing) => (isCapturing ? readGamepads(store, window.navigator) : NEVER)));
  },
  { functional: true },
);
