import { Inject, Injectable } from '@angular/core';
import { concatLatestFrom, createEffect } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { NEVER, Observable, filter, fromEvent, map, mergeMap, mergeWith, switchMap, take } from 'rxjs';

import { ControllerInputType, WINDOW } from '@app/shared';
import { ControllerType, controllerIdFn } from '../controllers';
import { controllerInputIdFn } from './controller-input.reducer';
import { CONTROLLER_INPUT_ACTIONS } from './controller-input.actions';
import { CONTROLLER_INPUT_SELECTORS } from './controller-input.selectors';
import { CONTROLLER_SETTINGS_SELECTORS, KeyboardSettingsModel } from '../controller-settings';

@Injectable()
export class KeyboardControllerInputEffects {
    public readonly keyDownEvent = 'keydown';

    public readonly keyUpEvent = 'keyup';

    public readonly captureKeyboardInput$ = createEffect(() => {
        return this.store.select(CONTROLLER_INPUT_SELECTORS.isCapturing).pipe(
            switchMap((isCapturing) => isCapturing ? this.readKeyboard() : NEVER)
        );
    });

    constructor(
        private readonly store: Store,
        @Inject(WINDOW) private readonly window: Window,
    ) {
    }

    private readKeyboard(): Observable<Action> {
        return this.store.select(CONTROLLER_SETTINGS_SELECTORS.selectByControllerId(controllerIdFn({ controllerType: ControllerType.Keyboard }))).pipe(
            map((s) => s as KeyboardSettingsModel),
            take(1),
            mergeMap((settings) => {
                if (settings?.captureNonAlphaNumerics) {
                    return fromEvent(this.window.document, this.keyDownEvent);
                } else {
                    return fromEvent(this.window.document, this.keyDownEvent).pipe(
                        filter((event) => /^[a-zA-Z0-9]$/.test((event as KeyboardEvent).key))
                    );
                }
            }),
            map((event) => ({ isPressed: true, event: event as KeyboardEvent })),
            mergeWith(fromEvent(this.window.document, this.keyUpEvent).pipe(
                map((event) => ({ isPressed: false, event: event as KeyboardEvent })),
            )),
            concatLatestFrom(() => this.store.select(CONTROLLER_INPUT_SELECTORS.selectEntities)),
            map(([ eventData, controllerInputEntities ]) => {
                const inputId = eventData.event.key;
                const prevState = controllerInputEntities[controllerInputIdFn({
                    controllerId: controllerIdFn({ controllerType: ControllerType.Keyboard }),
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
                controllerId: controllerIdFn({ controllerType: ControllerType.Keyboard }),
                inputId,
                inputType: ControllerInputType.Button,
                value: nextState
            }))
        );
    }
}
