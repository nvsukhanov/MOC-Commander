import { Actions, createEffect, ofType } from '@ngrx/effects';
import { inject } from '@angular/core';
import { Observable, map, mergeMap } from 'rxjs';
import { Action } from '@ngrx/store';

import { HUBS_ACTIONS, HUB_RUNTIME_DATA_ACTIONS } from '../../actions';
import { HubStorageService } from '../../hub-storage.service';

export const REQUEST_HUB_FIRMWARE_VERSION_ON_CONNECT = createEffect(
  (actions$: Actions = inject(Actions), hubStorage: HubStorageService = inject(HubStorageService)): Observable<Action> => {
    return actions$.pipe(
      ofType(HUBS_ACTIONS.connected),
      mergeMap(({ hubId }) => {
        return hubStorage
          .get(hubId)
          .properties.getFirmwareVersion()
          .pipe(
            map((firmwareVersion) =>
              HUB_RUNTIME_DATA_ACTIONS.setFirmwareVersion({
                hubId,
                firmwareVersion: `${firmwareVersion.major}.${firmwareVersion.minor}.${firmwareVersion.bugfix}.${firmwareVersion.build}`,
              }),
            ),
          );
      }),
    );
  },
  { functional: true },
);
