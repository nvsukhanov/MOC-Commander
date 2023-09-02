import { createSelector } from '@ngrx/store';
import { HUBS_SELECTORS, HUB_STATS_SELECTORS, HubModel } from '@app/store';

export type HubListViewModel = Array<{
    batteryLevel: number | null;
    rssi: number | null;
    isButtonPressed: boolean;
    hasCommunication: boolean;
    isConnected: boolean;
} & HubModel>;

export const HUBS_LIST_SELECTORS = {
    selectHubListViewModel: createSelector(
        HUBS_SELECTORS.selectAll,
        HUB_STATS_SELECTORS.selectEntities,
        (hubs, hubStats): HubListViewModel => {
            return hubs.map((hub) => ({
                ...hub,
                batteryLevel: hubStats[hub.hubId]?.batteryLevel ?? null,
                rssi: hubStats[hub.hubId]?.rssi ?? null,
                isButtonPressed: hubStats[hub.hubId]?.isButtonPressed || false,
                hasCommunication: hubStats[hub.hubId]?.hasCommunication || false,
                isConnected: !!hubStats[hub.hubId]
            }));
        }
    ),
} as const;
