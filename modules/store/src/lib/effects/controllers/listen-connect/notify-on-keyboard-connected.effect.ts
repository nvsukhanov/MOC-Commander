import { Actions, createEffect, ofType } from '@ngrx/effects';
import { inject } from '@angular/core';
import { map, mergeMap, take } from 'rxjs';
import { KeyboardProfileFactoryService } from '@app/controller-profiles';

import { CONTROLLERS_ACTIONS, SHOW_NOTIFICATION_ACTIONS } from '../../../actions';

export const NOTIFY_ON_HUB_KEYBOARD_CONNECTED_EFFECT = createEffect(
  (
    actions: Actions = inject(Actions),
    keyboardProfileFactoryService: KeyboardProfileFactoryService = inject(KeyboardProfileFactoryService),
  ) => {
    return actions.pipe(
      ofType(CONTROLLERS_ACTIONS.keyboardConnected),
      mergeMap(() =>
        keyboardProfileFactoryService.getKeyboardProfile().name$.pipe(
          take(1),
          map((name) =>
            SHOW_NOTIFICATION_ACTIONS.info({
              l10nKey: 'controller.controllerConnectedNotification',
              l10nPayload: { name },
            }),
          ),
        ),
      ),
    );
  },
  { functional: true },
);
