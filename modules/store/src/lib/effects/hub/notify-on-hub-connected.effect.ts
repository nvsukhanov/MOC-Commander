import { Actions, createEffect, ofType } from '@ngrx/effects';
import { inject } from '@angular/core';
import { map } from 'rxjs';

import { HUBS_ACTIONS, SHOW_NOTIFICATION_ACTIONS } from '../../actions';

export const NOTIFY_ON_HUB_CONNECTED_EFFECT = createEffect(
  (actions: Actions = inject(Actions)) => {
    return actions.pipe(
      ofType(HUBS_ACTIONS.connected),
      map((action) =>
        SHOW_NOTIFICATION_ACTIONS.info({
          l10nKey: 'hub.connected',
          l10nPayload: action,
        }),
      ),
    );
  },
  { functional: true },
);
