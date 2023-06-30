import { Inject, Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { filter, fromEvent, map, switchMap } from 'rxjs';
import { Store } from '@ngrx/store';

import { CONTROLLERS_ACTIONS } from './controllers.actions';
import { CONTROLLER_SELECTORS } from './controllers.selectors';
import { WINDOW } from '@app/shared';
import { controllerIdFn } from './controllers.reducer';
import { ControllerType } from './controller-model';

@Injectable()
export class KeyboardControllerEffects {
    public readonly keyDownEvent = 'keydown';

    public readonly listenForConnect$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(CONTROLLERS_ACTIONS.waitForConnect),
            switchMap(() => fromEvent(this.window.document, this.keyDownEvent)),
            concatLatestFrom(() => this.store.select(CONTROLLER_SELECTORS.selectKeyboards)),
            filter(([ , knownKeyboards ]) => knownKeyboards.length === 0),
            map(() => CONTROLLERS_ACTIONS.connected({
                id: controllerIdFn({ controllerType: ControllerType.Keyboard }),
                controllerType: ControllerType.Keyboard,
            }))
        );
    });

    constructor(
        private readonly actions$: Actions,
        @Inject(WINDOW) private readonly window: Window,
        private store: Store
    ) {
    }
}
