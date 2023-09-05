import { createSelector } from '@ngrx/store';
import { PortModeName } from 'rxpoweredup';
import { Dictionary } from '@ngrx/entity';
import {
    ATTACHED_IO_MODES_SELECTORS,
    ATTACHED_IO_PORT_MODE_INFO_SELECTORS,
    ATTACHED_IO_SELECTORS,
    AttachedIoModel,
    AttachedIoModesModel,
    AttachedIoPortModeInfoModel,
    HUBS_SELECTORS,
    HUB_STATS_SELECTORS
} from '@app/store';
import { ControlSchemeBindingType, getEnumValues } from '@app/shared';

import { getAvailableOperationModesForIoOutputPortModeNames, getIoOutputPortModeNames, ioHasMatchingModeForOpMode } from '../common';

function isIoControllableByBindingType(
    io: AttachedIoModel,
    attachedIoModesEntities: Dictionary<AttachedIoModesModel>,
    attachedIoPortModeInfoEntities: Dictionary<AttachedIoPortModeInfoModel>,
    bindingType: ControlSchemeBindingType
): boolean {
    const ioPortModeNames = getIoOutputPortModeNames(io, attachedIoModesEntities, attachedIoPortModeInfoEntities);
    return ioHasMatchingModeForOpMode(bindingType, ioPortModeNames);
}

export type HubWithConnectionState = {
    hubId: string;
    name: string;
    isConnected: boolean;
};

export type BindingTypeSelectViewModel = {
    bindingType: ControlSchemeBindingType;
    hubsCount: number;
};

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
    selectBindingTypeSelectViewModel: createSelector(
        ATTACHED_IO_SELECTORS.selectAll,
        ATTACHED_IO_MODES_SELECTORS.selectEntities,
        ATTACHED_IO_PORT_MODE_INFO_SELECTORS.selectEntities,
        (attachedIos, attachedIoModesEntities, attachedIoPortModeInfoEntities): BindingTypeSelectViewModel[] => {
            const allBindingTypes = getEnumValues(ControlSchemeBindingType);
            return allBindingTypes.map((bindingType) => {
                const applicableHubsCount = attachedIos.reduce((acc, io) => {
                    const inputPortModeNames = getIoOutputPortModeNames(io, attachedIoModesEntities, attachedIoPortModeInfoEntities);
                    const availableOperationModes = getAvailableOperationModesForIoOutputPortModeNames(inputPortModeNames);
                    if (availableOperationModes.includes(bindingType)) {
                        acc++;
                    }
                    return acc;
                }, 0);
                return { bindingType, hubsCount: applicableHubsCount };
            });
        }
    ),
    selectControllableHubs: (bindingType: ControlSchemeBindingType) => createSelector(
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
    selectControllableIos: ({ hubId, bindingType }: { hubId: string; bindingType: ControlSchemeBindingType }) => createSelector(
        ATTACHED_IO_SELECTORS.selectAll,
        ATTACHED_IO_MODES_SELECTORS.selectEntities,
        ATTACHED_IO_PORT_MODE_INFO_SELECTORS.selectEntities,
        (attachedIos, attachedIoModesEntities, attachedIoPortModeInfoEntities): AttachedIoModel[] => {
            return attachedIos.filter((io) => {
                return io.hubId === hubId && isIoControllableByBindingType(io, attachedIoModesEntities, attachedIoPortModeInfoEntities, bindingType);
            });
        }
    ),
    canRequestPortValue: ({ hubId, portId, portModeName }: { hubId: string; portId: number; portModeName: PortModeName }) => createSelector(
        HUB_STATS_SELECTORS.selectIsHubConnected(hubId),
        HUB_STATS_SELECTORS.isPortValueRequested({ hubId, portId }),
        ATTACHED_IO_SELECTORS.selectIoAtPort({ hubId, portId }),
        ATTACHED_IO_PORT_MODE_INFO_SELECTORS.selectHubPortInputModeForPortModeName({ hubId, portId, portModeName }),
        (isHubConnected, isPortValueRequested, io, modeInfo): boolean => {
            return isHubConnected && !isPortValueRequested && !!io && !!modeInfo;
        }
    ),
    canCalibrateServo: ({ hubId, portId }: { hubId: string; portId: number }) => createSelector(
        BINDING_EDIT_SELECTORS.canRequestPortValue({ hubId, portId, portModeName: PortModeName.position }),
        BINDING_EDIT_SELECTORS.canRequestPortValue({ hubId, portId, portModeName: PortModeName.absolutePosition }),
        (canRequestPosition, canRequestAbsolutePosition): boolean => {
            return canRequestPosition && canRequestAbsolutePosition;
        }
    ),
} as const;
