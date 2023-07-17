import { concatLatestFrom, createEffect } from '@ngrx/effects';
import {
    CONTROLLER_CONNECTION_SELECTORS,
    CONTROLLER_INPUT_ACTIONS,
    CONTROLLER_INPUT_SELECTORS,
    CONTROLLER_SETTINGS_SELECTORS,
    KeyboardSettingsModel,
    controllerInputIdFn
} from '@app/store';
import { NEVER, Observable, filter, fromEvent, map, mergeMap, mergeWith, switchMap, take } from 'rxjs';
import { Action, Store } from '@ngrx/store';
import { inject } from '@angular/core';
import { ControllerInputType, WINDOW } from '@app/shared';

const KEY_DOWN_EVENT = 'keydown';

const KEY_UP_EVENT = 'keyup';

function readKeyboard(
    store: Store,
    window: Window,
    controllerId: string
): Observable<Action> {
    return store.select(CONTROLLER_SETTINGS_SELECTORS.selectByControllerId(controllerId)).pipe(
        map((s) => s as KeyboardSettingsModel),
        take(1),
        mergeMap((settings) => {
            if (settings?.captureNonAlphaNumerics) {
                return fromEvent(window.document, KEY_DOWN_EVENT);
            } else {
                return fromEvent(window.document, KEY_DOWN_EVENT).pipe(
                    filter((event) => /^[a-zA-Z0-9]$/.test((event as KeyboardEvent).key))
                );
            }
        }),
        map((event) => ({ isPressed: true, event: event as KeyboardEvent })),
        mergeWith(fromEvent(window.document, KEY_UP_EVENT).pipe(
            map((event) => ({ isPressed: false, event: event as KeyboardEvent })),
        )),
        concatLatestFrom(() => store.select(CONTROLLER_INPUT_SELECTORS.selectEntities)),
        map(([ eventData, controllerInputEntities ]) => {
            const inputId = eventData.event.key;
            const prevState = controllerInputEntities[controllerInputIdFn({
                controllerId,
                inputId,
                inputType: ControllerInputType.Button
            })];
            return {
                inputId,
                prevState: prevState?.value,
                nextState: +eventData.isPressed
            };
        }),
        filter(({ prevState, nextState }) => prevState === undefined || prevState !== nextState),
        map(({ inputId, nextState }) => CONTROLLER_INPUT_ACTIONS.inputReceived({
            controllerId,
            inputId,
            inputType: ControllerInputType.Button,
            value: nextState
        }))
    );
}

export const CAPTURE_KEYBOARD_INPUT = createEffect((
    store: Store = inject(Store),
    window: Window = inject(WINDOW)
) => {
    return store.select(CONTROLLER_INPUT_SELECTORS.isKeyboardBeingCaptured).pipe(
        concatLatestFrom(() => store.select(CONTROLLER_CONNECTION_SELECTORS.selectKeyboardConnection)),
        switchMap(([ isCapturing, connection ]) => isCapturing && connection
                                                   ? readKeyboard(store, window, connection.controllerId)
                                                   : NEVER
        )
    ) as Observable<Action>;
}, { functional: true });
