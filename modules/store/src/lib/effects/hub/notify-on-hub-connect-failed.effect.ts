import { Actions, createEffect, ofType } from '@ngrx/effects';
import { inject } from '@angular/core';
import { map } from 'rxjs';

import { HUBS_ACTIONS, SHOW_NOTIFICATION_ACTIONS } from '../../actions';

export const NOTIFY_ON_HUB_CONNECT_FAILED_EFFECT = createEffect(
  (actions: Actions = inject(Actions)) => {
    return actions.pipe(
      ofType(HUBS_ACTIONS.deviceConnectFailed),
      map(() =>
        SHOW_NOTIFICATION_ACTIONS.error({
          l10nKey: 'hub.connectFailed',
        }),
      ),
    );
  },
  { functional: true },
);
