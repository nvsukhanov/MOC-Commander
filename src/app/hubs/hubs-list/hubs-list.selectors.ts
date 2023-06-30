import { createSelector } from '@ngrx/store';

import { HUBS_SELECTORS, HUB_STATS_SELECTORS } from '../../store';

export const HUBS_LIST_SELECTORS = {
    selectHubListViewModel: createSelector(
        HUBS_SELECTORS.selectAll,
        HUB_STATS_SELECTORS.selectEntities,
        (hubs, hubStats) => {
            return hubs.map((hub) => ({
                ...hub,
                batteryLevel: hubStats[hub.hubId]?.batteryLevel || null,
                rssi: hubStats[hub.hubId]?.rssi || null,
                isButtonPressed: hubStats[hub.hubId]?.isButtonPressed || false,
                hasCommunication: hubStats[hub.hubId]?.hasCommunication || false,
                isConnected: !!hubStats[hub.hubId]
            }));
        }
    ),
} as const;
