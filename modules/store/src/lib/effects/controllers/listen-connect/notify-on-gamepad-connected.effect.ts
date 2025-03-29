import { Actions, createEffect, ofType } from '@ngrx/effects';
import { inject } from '@angular/core';
import { map, mergeMap, take } from 'rxjs';
import { GamepadProfileFactoryService } from '@app/controller-profiles';

import { CONTROLLERS_ACTIONS, SHOW_NOTIFICATION_ACTIONS } from '../../../actions';

export const NOTIFY_ON_GAMEPAD_CONNECTED_EFFECT = createEffect(
  (
    actions: Actions = inject(Actions),
    gamepadProfileFactoryService: GamepadProfileFactoryService = inject(GamepadProfileFactoryService),
  ) => {
    return actions.pipe(
      ofType(CONTROLLERS_ACTIONS.gamepadConnected),
      mergeMap((action) =>
        gamepadProfileFactoryService.getByProfileUid(action.profileUid).name$.pipe(
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
