import { createSelector } from '@ngrx/store';
import { PortModeName } from '@nvsukhanov/rxpoweredup';
import { Dictionary } from '@ngrx/entity';
import {
    ATTACHED_IO_MODES_SELECTORS,
    ATTACHED_IO_PORT_MODE_INFO_SELECTORS,
    ATTACHED_IO_SELECTORS,
    AttachedIoModel,
    AttachedIoModesModel,
    AttachedIoPortModeInfoModel,
    HUBS_SELECTORS,
    HUB_STATS_SELECTORS,
    attachedIoModesIdFn,
    attachedIoPortModeInfoIdFn,
    attachedIosIdFn
} from '@app/store';
import { ControlSchemeBindingType } from '@app/shared';

import { HubWithConnectionState } from './types';
import { getIoOutputPortModeNames } from '../get-io-output-port-mode-names';
import { getAvailableOperationModesForIoOutputPortModeNames } from '../io-has-matching-mode-for-op-mode';

function getControllableIos(
    attachedIos: AttachedIoModel[],
    attachedIoModesEntities: Dictionary<AttachedIoModesModel>,
    attachedIoPortModeInfoEntities: Dictionary<AttachedIoPortModeInfoModel>
): AttachedIoModel[] {
    return attachedIos
        .filter((io) => {
            const inputPortModeNames = getIoOutputPortModeNames(io, attachedIoModesEntities, attachedIoPortModeInfoEntities);
            return getAvailableOperationModesForIoOutputPortModeNames(inputPortModeNames).length > 0;
        });
}

export const BINDING_EDIT_SELECTORS = {
    selectHubsWithConnectionState: createSelector(
        HUBS_SELECTORS.selectAll,
        HUB_STATS_SELECTORS.selectEntities,
        (hubs, hubStats): HubWithConnectionState[] => {
            return hubs.map((hub) => ({
                hubId: hub.hubId,
                name: hub.name,
                isConnected: !!hubStats[hub.hubId]
            }));
        }
    ),
    selectHubControllableIos: (hubId: string) => createSelector(
        ATTACHED_IO_SELECTORS.selectAll,
        ATTACHED_IO_MODES_SELECTORS.selectEntities,
        ATTACHED_IO_PORT_MODE_INFO_SELECTORS.selectEntities,
        (attachedIos, attachedIoModesEntities, attachedIoPortModeInfoEntities) => {
            return getControllableIos(
                attachedIos.filter((io) => io.hubId === hubId),
                attachedIoModesEntities,
                attachedIoPortModeInfoEntities
            );
        }
    ),
    selectAvailableBindingTypes: ({ hubId, portId }: { hubId: string; portId: number }) => createSelector(
        ATTACHED_IO_SELECTORS.selectEntities,
        ATTACHED_IO_MODES_SELECTORS.selectEntities,
        ATTACHED_IO_PORT_MODE_INFO_SELECTORS.selectEntities,
        (iosEntities, attachedIoModesEntities, attachedIoPortModeInfoEntities): ControlSchemeBindingType[] => {
            const io = iosEntities[attachedIosIdFn({ hubId, portId })];
            if (!io) {
                return [];
            }
            const inputPortModeNames = getIoOutputPortModeNames(io, attachedIoModesEntities, attachedIoPortModeInfoEntities);
            return getAvailableOperationModesForIoOutputPortModeNames(inputPortModeNames);
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
