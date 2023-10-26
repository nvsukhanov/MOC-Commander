import { MemoizedSelector, createSelector } from '@ngrx/store';
import { HUBS_SELECTORS, HUB_STATS_SELECTORS } from '@app/store';

export interface IHubTreeNodeViewModel {
    isHubKnown: boolean;
    name: string;
    hubId: string;
    batteryLevel: number;
    rssi: number;
    isButtonPressed: boolean;
    hasCommunication: boolean;
    isConnected: boolean;
}

export const HUB_TREE_NODE_SELECTORS = {
    selectViewModel: (hubId: string): MemoizedSelector<object, IHubTreeNodeViewModel> => createSelector(
        HUBS_SELECTORS.selectHub(hubId),
        HUB_STATS_SELECTORS.selectByHubId(hubId),
        (hub, hubStats): IHubTreeNodeViewModel => {
            return {
                isHubKnown: !!hub,
                name: hub?.name ?? '',
                hubId,
                batteryLevel: hubStats?.batteryLevel ?? 0,
                rssi: hubStats?.rssi ?? 0,
                isButtonPressed: hubStats?.isButtonPressed ?? false,
                hasCommunication: hubStats?.hasCommunication ?? false,
                isConnected: !!hubStats
            };
        }
    )
};
