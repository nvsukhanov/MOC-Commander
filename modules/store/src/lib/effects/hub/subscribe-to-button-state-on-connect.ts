import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, mergeMap } from 'rxjs';
import { inject } from '@angular/core';

import { HUBS_ACTIONS, HUB_RUNTIME_DATA_ACTIONS } from '../../actions';
import { HubStorageService } from '../../hub-storage.service';

export const SUBSCRIBE_TO_BUTTON_STATE_ON_CONNECT = createEffect((
    actions$: Actions = inject(Actions),
    hubStorage: HubStorageService = inject(HubStorageService)
) => {
    return actions$.pipe(
        ofType(HUBS_ACTIONS.connected),
        mergeMap((a) => hubStorage.get(a.hubId).properties.buttonState.pipe(
            map((isButtonPressed) => HUB_RUNTIME_DATA_ACTIONS.buttonStateReceived({ hubId: a.hubId, isButtonPressed }))
        ))
    );
}, { functional: true });

