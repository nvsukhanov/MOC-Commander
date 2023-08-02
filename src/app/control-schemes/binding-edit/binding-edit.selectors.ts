import { createSelector } from '@ngrx/store';
import { PortModeName } from '@nvsukhanov/rxpoweredup';
import {
    ATTACHED_IO_MODES_SELECTORS,
    ATTACHED_IO_PORT_MODE_INFO_SELECTORS,
    ATTACHED_IO_SELECTORS,
    AttachedIoModel,
    AttachedIoModesModel,
    HUBS_SELECTORS,
    HUB_STATS_SELECTORS,
    attachedIoModesIdFn,
    attachedIoPortModeInfoIdFn
} from '@app/store';
import { HubIoOperationMode } from '@app/shared';

import { getIoPortModes } from './get-hub-io-operation-modes';
import { ioHasMatchingModeForOpMode } from '../io-has-matching-mode-for-op-mode';
import { BindingEditAvailableOperationModesModel } from './types';

export const BINDING_EDIT_SELECTORS = {
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
    ),
    selectBindingEditAvailableOperationModes: createSelector(
        ATTACHED_IO_SELECTORS.selectAll,
        ATTACHED_IO_MODES_SELECTORS.selectEntities,
        ATTACHED_IO_PORT_MODE_INFO_SELECTORS.selectEntities,
        HUBS_SELECTORS.selectEntities,
        (ios, supportedModes, portModeData, hubs): BindingEditAvailableOperationModesModel => {
            const result: BindingEditAvailableOperationModesModel = {};
            const allOperationModes = Object.values(HubIoOperationMode) as ReadonlyArray<HubIoOperationMode>;
            const ioOperationModesMap = new Map<AttachedIoModel, HubIoOperationMode[]>(
                ios.map((io) => {
                    const portModes = getIoPortModes(io, supportedModes, portModeData);
                    const controllableOpModes = allOperationModes.filter((mode) => ioHasMatchingModeForOpMode(mode, portModes));
                    return [ io, controllableOpModes ];
                })
            );

            [ ...ioOperationModesMap.entries() ].forEach(([ io, operationModes ]) => {
                operationModes.forEach((opMode) => {
                    const hub = hubs[io.hubId];
                    if (!hub) {
                        return;
                    }
                    if (!result[opMode]) {
                        result[opMode] = {
                            hubs: [],
                            hubIos: {}
                        };
                    }
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    const resultRecord = result[opMode]!;
                    if (!resultRecord.hubIos[io.hubId]) {
                        resultRecord.hubs.push({ id: io.hubId, name: hub.name });
                        resultRecord.hubIos[io.hubId] = [];
                    }
                    resultRecord.hubIos[io.hubId].push(io);
                });
            });
            return result;
        }
    ),
    hasControllableIos: () => createSelector(
        BINDING_EDIT_SELECTORS.selectBindingEditAvailableOperationModes,
        (opModes) => {
            return Object.keys(opModes).length > 0;
        }
    )
} as const;
