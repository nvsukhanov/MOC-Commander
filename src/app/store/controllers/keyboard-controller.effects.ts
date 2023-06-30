import { inject } from '@angular/core';
import { Actions, FunctionalEffect, createEffect, ofType } from '@ngrx/effects';
import { fromEvent, map, switchMap, take } from 'rxjs';

import { CONTROLLERS_ACTIONS } from './controllers.actions';
import { WINDOW } from '@app/shared';
import { controllerIdFn } from './controllers.reducer';
import { ControllerType } from './controller-model';

const KEY_DOWN_EVENT = 'keydown';

export const KEYBOARD_CONTROLLER_EFFECTS: Record<string, FunctionalEffect> = {
    listenForConnect: createEffect((
        actions$: Actions = inject(Actions),
        window: Window = inject(WINDOW)
    ) => {
        return actions$.pipe(
            ofType(CONTROLLERS_ACTIONS.waitForConnect),
            switchMap(() => fromEvent(window.document, KEY_DOWN_EVENT)),
            map(() => CONTROLLERS_ACTIONS.connected({
                id: controllerIdFn({ controllerType: ControllerType.Keyboard }),
                controllerType: ControllerType.Keyboard,
            })),
            take(1)
        );
    }, { functional: true })
};
