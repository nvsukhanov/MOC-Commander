import { createEffect } from '@ngrx/effects';
import { NEVER, Observable, filter, fromEvent, map, mergeMap, mergeWith, switchMap, take } from 'rxjs';
import { Action, Store } from '@ngrx/store';
import { inject } from '@angular/core';
import { concatLatestFrom } from '@ngrx/operators';
import { ControllerInputType, ControllerType } from '@app/controller-profiles';
import { WINDOW } from '@app/shared-misc';

import {
  CONTROLLER_CONNECTION_SELECTORS,
  CONTROLLER_INPUT_SELECTORS,
  CONTROLLER_SETTINGS_SELECTORS,
} from '../../../selectors';
import { CONTROLLER_INPUT_ACTIONS } from '../../../actions';
import { controllerInputIdFn } from '../../../reducers';
import { KeyboardSettingsModel } from '../../../models';
import { filterKeyboardInput } from '../filter-keyboard-input';

const KEY_DOWN_EVENT = 'keydown';

const KEY_UP_EVENT = 'keyup';

function readKeyboard(store: Store, window: Window, controllerId: string): Observable<Action> {
  return store.select(CONTROLLER_SETTINGS_SELECTORS.selectByControllerId(controllerId)).pipe(
    filter((s): s is KeyboardSettingsModel => s?.controllerType === ControllerType.Keyboard && !s.ignoreInput),
    take(1),
    mergeMap((settings) => {
      return fromEvent(window.document, KEY_DOWN_EVENT).pipe(
        filterKeyboardInput(settings.captureNonAlphaNumerics),
        map((event) => ({ isPressed: true, event })),
        mergeWith(
          fromEvent(window.document, KEY_UP_EVENT).pipe(
            filterKeyboardInput(settings.captureNonAlphaNumerics),
            map((event) => ({ isPressed: false, event })),
          ),
        ),
      );
    }),
    concatLatestFrom(() => store.select(CONTROLLER_INPUT_SELECTORS.selectEntities)),
    map(([eventData, controllerInputEntities]) => {
      const inputId = eventData.event.key;
      const prevState =
        controllerInputEntities[
          controllerInputIdFn({
            controllerId,
            inputId,
            inputType: ControllerInputType.Button,
          })
        ];
      return {
        inputId,
        prevValue: prevState?.rawValue ?? 0,
        value: +eventData.isPressed,
      };
    }),
    filter(({ prevValue, value }) => prevValue !== value),
    map(({ inputId, value }) =>
      CONTROLLER_INPUT_ACTIONS.inputReceived({
        nextState: {
          controllerId,
          inputId,
          inputType: ControllerInputType.Button,
          rawValue: value,
          timestamp: Date.now(),
        },
      }),
    ),
  );
}

export const CAPTURE_KEYBOARD_INPUT = createEffect(
  (store: Store = inject(Store), window: Window = inject(WINDOW)) => {
    return store.select(CONTROLLER_INPUT_SELECTORS.isKeyboardBeingCaptured).pipe(
      concatLatestFrom(() => store.select(CONTROLLER_CONNECTION_SELECTORS.selectKeyboardConnection)),
      switchMap(([isCapturing, connection]) =>
        isCapturing && connection ? readKeyboard(store, window, connection.controllerId) : NEVER,
      ),
    ) as Observable<Action>;
  },
  { functional: true },
);
