import { createSelector } from '@ngrx/store';
import { Dictionary } from '@ngrx/entity';
import {
    ATTACHED_IO_MODES_SELECTORS,
    ATTACHED_IO_PORT_MODE_INFO_SELECTORS,
    ATTACHED_IO_SELECTORS,
    AttachedIoModel,
    AttachedIoModesModel,
    AttachedIoPortModeInfoModel,
    HUBS_SELECTORS,
    HUB_RUNTIME_DATA_SELECTORS,
    ROUTER_SELECTORS,
    attachedIoModesIdFn,
    attachedIoPortModeInfoIdFn
} from '@app/store';

function combineFullIoInfo(
    ios: AttachedIoModel[],
    supportedModesEntities: Dictionary<AttachedIoModesModel>,
    portModeDataEntities: Dictionary<AttachedIoPortModeInfoModel>
): HubIoViewModel[] {
    return ios.map((io) => {
        const supportedModesEntityId = attachedIoModesIdFn(io);
        const supportedModes: AttachedIoModesModel | undefined = supportedModesEntities[supportedModesEntityId];
        const portInputModeIds = supportedModes?.portInputModes ?? [];
        const portOutputModeIds = supportedModes?.portOutputModes ?? [];
        const portInputModes = portInputModeIds.map((modeId) => {
            const modeEntityId = attachedIoPortModeInfoIdFn({ ...io, modeId });
            return portModeDataEntities[modeEntityId];
        }).filter((mode) => !!mode) as AttachedIoPortModeInfoModel[];
        const portOutputModes = portOutputModeIds.map((modeId) => {
            const modeEntityId = attachedIoPortModeInfoIdFn({ ...io, modeId });
            return portModeDataEntities[modeEntityId];
        }).filter((mode) => !!mode) as AttachedIoPortModeInfoModel[];

        return {
            ...io,
            portInputModes,
            portOutputModes,
            synchronizable: supportedModes?.synchronizable ?? false,
        };
    });
}

export type HubIoViewModel = {
    portInputModes: AttachedIoPortModeInfoModel[];
    portOutputModes: AttachedIoPortModeInfoModel[];
    synchronizable: boolean;
} & AttachedIoModel;

export const HUB_VIEW_PAGE_SELECTORS = {
    selectCurrentlyViewedHubModel: createSelector(
        ROUTER_SELECTORS.selectCurrentlyViewedHubId,
        HUBS_SELECTORS.selectEntities,
        (hubId, hubs) => {
            return hubId !== null ? hubs[hubId] : undefined;
        }
    ),
    selectCurrentlyViewedHubRuntimeData: createSelector(
        ROUTER_SELECTORS.selectCurrentlyViewedHubId,
        HUB_RUNTIME_DATA_SELECTORS.selectEntities,
        (hubId, hubRuntimeDataEntities) => {
            return hubId !== null && !!hubRuntimeDataEntities ? hubRuntimeDataEntities[hubId] : undefined;
        }
    ),
    selectCurrentlyViewedHubIoFullInfo: createSelector(
        ROUTER_SELECTORS.selectCurrentlyViewedHubId,
        ATTACHED_IO_SELECTORS.selectAll,
        ATTACHED_IO_MODES_SELECTORS.selectEntities,
        ATTACHED_IO_PORT_MODE_INFO_SELECTORS.selectEntities,
        (hubId, allIos, supportedModesEntities, portModeDataEntities): HubIoViewModel[] => {
            if (hubId === null) {
                return [];
            }
            const ios = allIos.filter((io) => io.hubId === hubId);
            return combineFullIoInfo(ios, supportedModesEntities, portModeDataEntities);
        }
    ),
    selectIsCurrentlyViewedHubConnected: createSelector(
        ROUTER_SELECTORS.selectCurrentlyViewedHubId,
        HUB_RUNTIME_DATA_SELECTORS.selectEntities,
        (hubId, hubRuntimeDataEntities) => {
            return hubId !== null && !!hubRuntimeDataEntities[hubId];
        }
    )
} as const;
