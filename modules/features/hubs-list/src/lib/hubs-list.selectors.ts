import { createSelector } from '@ngrx/store';
import { HUBS_SELECTORS, HUB_RUNTIME_DATA_SELECTORS, HubModel } from '@app/store';

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
        HUB_RUNTIME_DATA_SELECTORS.selectEntities,
        (hubs, hubRuntimeData): HubListViewModel => {
            return hubs.map((hub) => ({
                ...hub,
                batteryLevel: hubRuntimeData[hub.hubId]?.batteryLevel ?? null,
                rssi: hubRuntimeData[hub.hubId]?.rssi ?? null,
                isButtonPressed: hubRuntimeData[hub.hubId]?.isButtonPressed || false,
                hasCommunication: hubRuntimeData[hub.hubId]?.hasCommunication || false,
                isConnected: !!hubRuntimeData[hub.hubId]
            }));
        }
    ),
} as const;
