import { Actions, createEffect, ofType } from '@ngrx/effects';
import { inject } from '@angular/core';
import { fromEvent, map, switchMap, take } from 'rxjs';
import { Store } from '@ngrx/store';
import { concatLatestFrom } from '@ngrx/operators';
import { KeyboardProfileFactoryService } from '@app/controller-profiles';
import { WINDOW } from '@app/shared-misc';

import { CONTROLLERS_ACTIONS } from '../../../actions';
import { CONTROLLER_SELECTORS } from '../../../selectors';

const KEY_DOWN_EVENT = 'keydown';

export const LISTEN_KEYBOARD_CONNECT = createEffect((
    actions$: Actions = inject(Actions),
    window: Window = inject(WINDOW),
    store: Store = inject(Store),
    keyboardProfileFactoryService: KeyboardProfileFactoryService = inject(KeyboardProfileFactoryService),
) => {
    return actions$.pipe(
        ofType(CONTROLLERS_ACTIONS.waitForConnect),
        switchMap(() => fromEvent(window.document, KEY_DOWN_EVENT)),
        concatLatestFrom(() => store.select(CONTROLLER_SELECTORS.selectKeyboard)),
        map(([ , knownKeyboard ]) => {
            const controllerProfile = keyboardProfileFactoryService.getKeyboardProfile();
            const profileUid = controllerProfile.uid;
            return knownKeyboard ?
                   CONTROLLERS_ACTIONS.keyboardConnected({ profileUid }) :
                   CONTROLLERS_ACTIONS.keyboardDiscovered({ profileUid, defaultSettings: controllerProfile.getDefaultSettings() });
        }),
        take(1)
    );
}, { functional: true });
