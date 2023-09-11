import { createSelector } from '@ngrx/store';
import { PortModeName } from 'rxpoweredup';
import { ATTACHED_IO_MODES_SELECTORS, ATTACHED_IO_PORT_MODE_INFO_SELECTORS, ATTACHED_IO_SELECTORS, HUB_STATS_SELECTORS } from '@app/store';
import { ControlSchemeBindingType, getEnumValues } from '@app/shared';

import { getIoOutputPortModeNames } from '../get-io-output-port-mode-names';
import { getAvailableOperationModesForIoOutputPortModeNames } from '../io-has-matching-mode-for-op-mode';

export type BindingTypeSelectViewModel = {
    bindingType: ControlSchemeBindingType;
    hubsCount: number;
};

export const BINDING_EDIT_SELECTORS = {
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
