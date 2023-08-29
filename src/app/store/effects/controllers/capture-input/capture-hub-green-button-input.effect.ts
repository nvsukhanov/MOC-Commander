import { createEffect } from '@ngrx/effects';
import { Action, Store, createSelector } from '@ngrx/store';
import { inject } from '@angular/core';
import { NEVER, Observable, map, mergeAll, mergeMap, switchMap } from 'rxjs';
import { CONTROLLER_INPUT_ACTIONS, CONTROLLER_INPUT_SELECTORS, HUBS_SELECTORS, HUB_STATS_SELECTORS, HubStorageService, controllerIdFn } from '@app/store';
import { ControllerInputType, ControllerType } from '@app/shared';

import { GREEN_BUTTON_INPUT_ID } from '../../../../controller-profiles/hub';

const CONNECTED_HUBS_SELECTOR = createSelector(
    HUBS_SELECTORS.selectAll,
    HUB_STATS_SELECTORS.selectIds,
    (hubs, hubStatsIds) => {
        const hubStatsIdsSet = new Set(hubStatsIds.map((id) => id.toString())); // TODO: I don't like this toString() here
        return hubs.filter((hub) => hubStatsIdsSet.has(hub.hubId)).map((hub) => hub.hubId);
    }
);

function readHubsGreenButtons(
    store: Store,
    hubStorage: HubStorageService
): Observable<Action> {
    return store.select(CONNECTED_HUBS_SELECTOR).pipe(
        map((hubIds) => {
            return hubIds.map((hubId) => {
                return hubStorage.get(hubId).properties.buttonState.pipe(
                    map((isButtonPressed) => {
                        const value = isButtonPressed ? 1 : 0;
                        return CONTROLLER_INPUT_ACTIONS.inputReceived({
                            controllerId: controllerIdFn({ hubId, controllerType: ControllerType.Hub }),
                            inputType: ControllerInputType.Button,
                            inputId: GREEN_BUTTON_INPUT_ID,
                            value,
                            rawValue: value,
                            timestamp: Date.now()
                        });
                    })
                );
            });
        }),
        mergeAll(),
        mergeMap((t) => t),
    );
}

export const CAPTURE_HUB_GREEN_BUTTON_INPUT = createEffect((
    store: Store = inject(Store),
    hubStorage: HubStorageService = inject(HubStorageService)
) => {
    return store.select(CONTROLLER_INPUT_SELECTORS.isCapturing).pipe(
        switchMap((isCapturing) => isCapturing
                                   ? readHubsGreenButtons(store, hubStorage)
                                   : NEVER
        )
    );
}, { functional: true });

