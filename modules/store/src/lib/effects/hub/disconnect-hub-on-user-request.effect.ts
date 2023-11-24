import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { filter, mergeMap } from 'rxjs';
import { Store } from '@ngrx/store';
import { inject } from '@angular/core';

import { HUBS_ACTIONS } from '../../actions';
import { HUBS_SELECTORS } from '../../selectors';
import { HubStorageService } from '../../hub-storage.service';

export const DISCONNECT_HUB_ON_USER_REQUEST = createEffect((
    actions$: Actions = inject(Actions),
    hubStorage: HubStorageService = inject(HubStorageService),
    store: Store = inject(Store),
) => {
    return actions$.pipe(
        ofType(HUBS_ACTIONS.userRequestedHubDisconnection),
        concatLatestFrom((action) => store.select(HUBS_SELECTORS.selectHub(action.hubId))),
        filter(([ , hub ]) => !!hub),
        mergeMap(([ action ]) => hubStorage.get(action.hubId).disconnect())
    );
}, { functional: true, dispatch: false });
