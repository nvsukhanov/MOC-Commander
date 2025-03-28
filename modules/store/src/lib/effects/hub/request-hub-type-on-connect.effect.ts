import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, mergeMap, takeUntil } from 'rxjs';
import { inject } from '@angular/core';

import { HUBS_ACTIONS } from '../../actions';
import { HubStorageService } from '../../hub-storage.service';

export const REQUEST_HUB_TYPE_ON_CONNECT = createEffect(
  (actions$: Actions = inject(Actions), hubStorage: HubStorageService = inject(HubStorageService)) => {
    return actions$.pipe(
      ofType(HUBS_ACTIONS.connected),
      mergeMap((action) => {
        const hub = hubStorage.get(action.hubId);
        return hub.properties.getSystemTypeId().pipe(
          takeUntil(hubStorage.get(action.hubId).disconnected),
          map((hubType) => HUBS_ACTIONS.hubTypeReceived({ hubId: action.hubId, hubType })),
        );
      }),
    );
  },
  { functional: true },
);
