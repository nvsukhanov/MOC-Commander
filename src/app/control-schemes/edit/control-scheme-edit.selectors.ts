import { createSelector } from '@ngrx/store';
import { PortModeName } from '@nvsukhanov/rxpoweredup';
import {
    ATTACHED_IO_MODES_SELECTORS,
    ATTACHED_IO_PORT_MODE_INFO_SELECTORS,
    ATTACHED_IO_SELECTORS,
    AttachedIoModesModel,
    HUBS_SELECTORS,
    HUB_STATS_SELECTORS,
    attachedIoModesIdFn,
    attachedIoPortModeInfoIdFn
} from '@app/store';

export const CONTROL_SCHEME_EDIT_SELECTORS = {
    selectHubsWithConnectionState: createSelector(
        HUBS_SELECTORS.selectAll,
        HUB_STATS_SELECTORS.selectEntities,
        (hubs, hubStats) => {
            return hubs.map((hub) => ({
                ...hub,
                isConnected: !!hubStats[hub.hubId]
            }));
        }
    ),
    canCalibrateServo: ({ hubId, portId }: { hubId: string; portId: number }) => createSelector(
        HUB_STATS_SELECTORS.selectIsHubConnected(hubId),
        ATTACHED_IO_SELECTORS.selectIoAtPort({ hubId, portId }),
        ATTACHED_IO_MODES_SELECTORS.selectEntities,
        ATTACHED_IO_PORT_MODE_INFO_SELECTORS.selectEntities,
        (isHubConnected, io, supportedModesEntities, portModesEntities): boolean => {
            if (!io || !isHubConnected) {
                return false;
            }
            const modesInfo: AttachedIoModesModel | undefined =
                supportedModesEntities[attachedIoModesIdFn(io)];
            if (!modesInfo) {
                return false;
            }
            const portOutputModes = modesInfo.portOutputModes;
            const portModes = new Set(portOutputModes
                .map((modeId) => portModesEntities[attachedIoPortModeInfoIdFn({ ...io, modeId })])
                .map((portModeInfo) => portModeInfo?.name)
                .filter((portModeInfo) => !!portModeInfo)
            ) as ReadonlySet<PortModeName>;

            return portModes.has(PortModeName.position) && portModes.has(PortModeName.absolutePosition);
        }
    )
} as const;
