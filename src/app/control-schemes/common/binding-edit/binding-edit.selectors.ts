import { createSelector } from '@ngrx/store';
import { PortModeName } from 'rxpoweredup';
import { ATTACHED_IO_PORT_MODE_INFO_SELECTORS, ATTACHED_IO_SELECTORS, HUB_STATS_SELECTORS } from '@app/store';

export const BINDING_EDIT_SELECTORS = {
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
