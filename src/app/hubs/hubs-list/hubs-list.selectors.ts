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
                RSSI: hubStats[hub.hubId]?.RSSI || null,
                isButtonPressed: hubStats[hub.hubId]?.isButtonPressed || false,
                hasCommunication: hubStats[hub.hubId]?.hasCommunication || false,
                isConnected: !!hubStats[hub.hubId]
            }));
        }
    ),
} as const;
