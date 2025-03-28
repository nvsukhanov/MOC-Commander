import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, mergeMap, tap } from 'rxjs';
import { inject } from '@angular/core';

import { HUBS_ACTIONS } from '../../actions';
import { HubStorageService } from '../../hub-storage.service';

export const TRACK_HUB_DISCONNECTS_EFFECT = createEffect(
  (actions$: Actions = inject(Actions), hubStorage: HubStorageService = inject(HubStorageService)) => {
    return actions$.pipe(
      ofType(HUBS_ACTIONS.connected),
      mergeMap((action) =>
        hubStorage.get(action.hubId).disconnected.pipe(
          tap(() => {
            hubStorage.removeHub(action.hubId);
          }),
          map(() => HUBS_ACTIONS.disconnected({ hubId: action.hubId, name: action.name })),
        ),
      ),
    );
  },
  { functional: true },
);
