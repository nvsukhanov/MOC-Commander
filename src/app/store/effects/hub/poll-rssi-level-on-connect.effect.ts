import { Actions, createEffect, ofType } from '@ngrx/effects';
import { interval, map, mergeMap, startWith, switchMap, takeUntil } from 'rxjs';
import { inject } from '@angular/core';
import { APP_CONFIG, IAppConfig } from '@app/shared';

import { HUBS_ACTIONS, HUB_STATS_ACTIONS } from '../../actions';
import { HubStorageService } from '../../hub-storage.service';

export const POLL_RSSI_LEVEL_ON_CONNECT = createEffect((
    actions$: Actions = inject(Actions),
    hubStorage: HubStorageService = inject(HubStorageService),
    config: IAppConfig = inject(APP_CONFIG),
) => {
    return actions$.pipe(
        ofType(HUBS_ACTIONS.connected),
        mergeMap((a) => interval(config.hubRssiPollInterval).pipe(
            startWith(0),
            takeUntil(hubStorage.get(a.hubId).disconnected),
            switchMap(() => hubStorage.get(a.hubId).properties.getRSSILevel()),
            map((rssi) => HUB_STATS_ACTIONS.rssiLevelReceived({ hubId: a.hubId, rssi }))
        ))
    );
}, { functional: true });
