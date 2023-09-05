import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, mergeMap, takeUntil } from 'rxjs';
import { inject } from '@angular/core';
import { HUBS_ACTIONS, HUB_STATS_ACTIONS, HubStorageService } from '@app/store';

export const SUBSCRIBE_TO_BUTTON_STATE_ON_CONNECT = createEffect((
    actions$: Actions = inject(Actions),
    hubStorage: HubStorageService = inject(HubStorageService),
) => {
    return actions$.pipe(
        ofType(HUBS_ACTIONS.connected),
        mergeMap((a) => hubStorage.get(a.hubId).properties.buttonState.pipe(
            takeUntil(hubStorage.get(a.hubId).disconnected),
            map((isButtonPressed) => HUB_STATS_ACTIONS.buttonStateReceived({ hubId: a.hubId, isButtonPressed }))
        ))
    );
}, { functional: true });
