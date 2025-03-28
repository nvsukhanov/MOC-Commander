import { Actions, createEffect, ofType } from '@ngrx/effects';
import { inject } from '@angular/core';
import { map } from 'rxjs';

import { CONTROLLERS_ACTIONS, HUBS_ACTIONS } from '../../../actions';

export const LISTEN_HUB_DISCONNECT = createEffect(
  (actions$: Actions = inject(Actions)) => {
    return actions$.pipe(
      ofType(HUBS_ACTIONS.disconnected),
      map((action) => CONTROLLERS_ACTIONS.hubDisconnected({ hubId: action.hubId })),
    );
  },
  { functional: true },
);
