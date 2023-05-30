import { Inject, Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { WINDOW } from '../../../common';
import { CONTROLLER_INPUT_ACTIONS, CONTROLLERS_ACTIONS } from '../../actions';
import { filter, fromEvent, map, mergeWith, NEVER, Observable, switchMap } from 'rxjs';
import { CONTROLLER_INPUT_CAPTURE_SELECTORS, CONTROLLER_INPUT_SELECTORS, CONTROLLER_SELECTORS } from '../../selectors';
import { ControllerInputType } from '../../i-state';
import { controllerInputIdFn } from '../../entity-adapters';
import { ControllerType } from '../../../plugins';

@Injectable()
export class KeyboardControllerEffects {
    public readonly keyDownEvent = 'keydown';

    public readonly keyUpEvent = 'keyup';

    public readonly keyboardId = 'keyboard';

    public readonly waitForConnect$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(CONTROLLERS_ACTIONS.waitForConnect),
            switchMap(() => fromEvent(this.window.document, this.keyDownEvent)),
            concatLatestFrom(() => this.store.select(CONTROLLER_SELECTORS.selectKeyboards)),
            filter(([ , knownKeyboards ]) => knownKeyboards.length === 0),
            map(() => CONTROLLERS_ACTIONS.connected({
                id: 'keyboard',
                controllerType: ControllerType.Keyboard,
            }))
        );
    });

    public readonly captureKeyboardInput$ = createEffect(() => {
        return this.store.select(CONTROLLER_INPUT_CAPTURE_SELECTORS.isCapturing).pipe(
            switchMap((isCapturing) => isCapturing ? this.readKeyboard() : NEVER)
        );
    });

    constructor(
        private readonly actions$: Actions,
        private readonly store: Store,
        @Inject(WINDOW) private readonly window: Window,
    ) {

    }

    private readKeyboard(): Observable<Action> {
        return fromEvent(this.window.document, this.keyDownEvent).pipe(
            map((event) => ({ isPressed: true, event: event as KeyboardEvent })),
            mergeWith(fromEvent(this.window.document, this.keyUpEvent).pipe(
                map((event) => ({ isPressed: false, event: event as KeyboardEvent })),
            )),
            concatLatestFrom(() => this.store.select(CONTROLLER_INPUT_SELECTORS.selectEntities)),
            map(([ eventData, controllerInputEntities ]) => {
                const inputId = eventData.event.key;
                const prevState = controllerInputEntities[controllerInputIdFn({
                    controllerId: this.keyboardId,
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
                controllerId: this.keyboardId,
                inputId,
                inputType: ControllerInputType.Button,
                value: nextState
            }))
        );
    }
}
