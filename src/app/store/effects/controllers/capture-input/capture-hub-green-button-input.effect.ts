import { createEffect } from '@ngrx/effects';
import { Action, Store, createSelector } from '@ngrx/store';
import { inject } from '@angular/core';
import { NEVER, Observable, distinctUntilChanged, map, mergeAll, mergeMap, pairwise, startWith, switchMap } from 'rxjs';
import {
    CONTROLLER_INPUT_ACTIONS,
    CONTROLLER_INPUT_SELECTORS,
    CONTROLLER_SETTINGS_SELECTORS,
    HUBS_SELECTORS,
    HUB_STATS_SELECTORS,
    HubStorageService,
    controllerIdFn
} from '@app/store';
import { ControllerInputType, ControllerType, GREEN_BUTTON_INPUT_ID } from '@app/shared';

const HUB_INPUT_READ_SELECTOR = createSelector(
    HUBS_SELECTORS.selectAll,
    HUB_STATS_SELECTORS.selectIds,
    CONTROLLER_SETTINGS_SELECTORS.selectEntities,
    (hubs, hubStatsIds, settings) => {
        const hubStatsIdsSet = new Set<string | number>(hubStatsIds);
        return hubs.filter((hub) => hubStatsIdsSet.has(hub.hubId)).map((hub) => hub.hubId)
                   .filter((hub) => {
                       const hubControllerId = controllerIdFn({ hubId: hub, controllerType: ControllerType.Hub });
                       const hubSettings = settings[hubControllerId];
                       return !(hubSettings?.ignoreInput);
                   });
    }
);

function readHubsGreenButtons(
    store: Store,
    hubStorage: HubStorageService
): Observable<Action> {
    return store.select(HUB_INPUT_READ_SELECTOR).pipe(
        map((hubIds) => {
            return hubIds.map((hubId) => {
                return hubStorage.get(hubId).properties.buttonState.pipe(
                    startWith(null),
                    distinctUntilChanged(),
                    pairwise(),
                    map(([ prev, next ]) => {
                        const value = next ? 1 : 0;
                        return CONTROLLER_INPUT_ACTIONS.inputReceived({
                            nextState: {
                                controllerId: controllerIdFn({ hubId, controllerType: ControllerType.Hub }),
                                inputType: ControllerInputType.Button,
                                inputId: GREEN_BUTTON_INPUT_ID,
                                value,
                                rawValue: value,
                                timestamp: Date.now()
                            },
                            prevValue: +!!prev
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

