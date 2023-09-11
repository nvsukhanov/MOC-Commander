import { MemoizedSelector, createSelector } from '@ngrx/store';
import { ControlSchemeBindingType } from '@app/shared';
import { ATTACHED_IO_MODES_SELECTORS, ATTACHED_IO_PORT_MODE_INFO_SELECTORS, ATTACHED_IO_SELECTORS, HUBS_SELECTORS, HUB_STATS_SELECTORS } from '@app/store';

import { isIoControllableByBindingType } from '../../is-io-controllable-by-binding-type';

export type HubWithConnectionState = {
    hubId: string;
    name: string;
    isConnected: boolean;
};

export const BINDING_CONTROL_SELECT_HUB_SELECTORS = {
    selectControllableHubs: (bindingType: ControlSchemeBindingType): MemoizedSelector<object, HubWithConnectionState[]> => createSelector(
        HUBS_SELECTORS.selectAll,
        ATTACHED_IO_SELECTORS.selectAll,
        ATTACHED_IO_MODES_SELECTORS.selectEntities,
        ATTACHED_IO_PORT_MODE_INFO_SELECTORS.selectEntities,
        HUB_STATS_SELECTORS.selectEntities,
        (hubs, attachedIos, attachedIoModesEntities, attachedIoPortModeInfoEntities, hubsConnectionStates): HubWithConnectionState[] => {
            // Inefficient due to the nested loops, but the number of hubs and attached IOs is small. Also, it keeps sorting of the hubs.
            return hubs.filter(({ hubId }) => attachedIos.some((io) =>
                io.hubId === hubId && isIoControllableByBindingType(io, attachedIoModesEntities, attachedIoPortModeInfoEntities, bindingType)
            )).map((hub) => ({
                hubId: hub.hubId,
                name: hub.name,
                isConnected: !!hubsConnectionStates[hub.hubId]
            }));
        }
    ),
};
