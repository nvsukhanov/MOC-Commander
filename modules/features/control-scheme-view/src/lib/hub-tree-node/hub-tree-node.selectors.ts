import { MemoizedSelector, createSelector } from '@ngrx/store';
import { HUBS_SELECTORS, HUB_RUNTIME_DATA_SELECTORS } from '@app/store';

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
        HUB_RUNTIME_DATA_SELECTORS.selectByHubId(hubId),
        (hub, hubRuntimeData): IHubTreeNodeViewModel => {
            return {
                isHubKnown: !!hub,
                name: hub?.name ?? '',
                hubId,
                batteryLevel: hubRuntimeData?.batteryLevel ?? 0,
                rssi: hubRuntimeData?.rssi ?? 0,
                isButtonPressed: hubRuntimeData?.isButtonPressed ?? false,
                hasCommunication: hubRuntimeData?.hasCommunication ?? false,
                isConnected: !!hubRuntimeData
            };
        }
    )
};
