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
    CONTROLLER_SELECTORS,
    HUBS_SELECTORS,
    HUB_STATS_SELECTORS,
    attachedIoModesIdFn,
    attachedIoPortModeInfoIdFn
} from '@app/store';
import { ControllerInputType, HubIoOperationMode } from '@app/shared';

import { getHubIoOperationModes } from '../get-hub-io-operation-modes';

function selectIosControllableByInputType(
    ios: AttachedIoModel[],
    supportedModes: Dictionary<AttachedIoModesModel>,
    portModeData: Dictionary<AttachedIoPortModeInfoModel>,
    inputType: ControllerInputType
): IoWithOperationModes[] {
    return ios.map((ioConfig) => ({
        ioConfig,
        operationModes: getHubIoOperationModes(ioConfig, supportedModes, portModeData, inputType)
    })).filter((io) => io.operationModes.length > 0);
}

export type IoWithOperationModes = {
    ioConfig: AttachedIoModel;
    operationModes: HubIoOperationMode[];
};

export const CONTROL_SCHEME_EDIT_SELECTORS = {
    canAddBinding: createSelector(
        HUBS_SELECTORS.selectAll,
        CONTROLLER_SELECTORS.selectAll,
        (hubs, controllers) => hubs.length > 0 && controllers.length > 0
    ),
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
    selectFirstIoControllableByInputType: (inputType: ControllerInputType) => createSelector(
        ATTACHED_IO_SELECTORS.selectAll,
        ATTACHED_IO_MODES_SELECTORS.selectEntities,
        ATTACHED_IO_PORT_MODE_INFO_SELECTORS.selectEntities,
        (ios, supportedModes, portModeData) => selectIosControllableByInputType(ios, supportedModes, portModeData, inputType)[0]
    ),
    selectHubIosControllableByInputType: (hubId: string, inputType: ControllerInputType) => createSelector(
        ATTACHED_IO_SELECTORS.selectHubIos(hubId),
        ATTACHED_IO_MODES_SELECTORS.selectEntities,
        ATTACHED_IO_PORT_MODE_INFO_SELECTORS.selectEntities,
        (ios, supportedModes, portModeData) => selectIosControllableByInputType(ios, supportedModes, portModeData, inputType)
    ),
    canCalibrateServo: ({ hubId, portId }: { hubId: string; portId: number }) => createSelector(
        HUB_STATS_SELECTORS.selectIsHubConnected(hubId),
        ATTACHED_IO_SELECTORS.selectIoAtPort({ hubId, portId }),
        ATTACHED_IO_MODES_SELECTORS.selectEntities,
        ATTACHED_IO_PORT_MODE_INFO_SELECTORS.selectEntities,
        (isHubConnected, io, supportedModesEntities, portModesEntities) => {
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
    ),
    selectHubIoOperationModes: (
        hubId: string,
        portId: number,
        inputType: ControllerInputType
    ) => createSelector(
        ATTACHED_IO_SELECTORS.selectIoAtPort({ hubId, portId }),
        ATTACHED_IO_MODES_SELECTORS.selectEntities,
        ATTACHED_IO_PORT_MODE_INFO_SELECTORS.selectEntities,
        (io, supportedModes, portModeData) => {
            if (io) {
                return getHubIoOperationModes(io, supportedModes, portModeData, inputType);
            }
            return [];
        }
    ),
} as const;
