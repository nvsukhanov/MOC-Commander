import { createSelector } from '@ngrx/store';
import { PortModeName } from 'rxpoweredup';
import { ATTACHED_IO_PORT_MODE_INFO_SELECTORS, ATTACHED_IO_SELECTORS, HUB_RUNTIME_DATA_SELECTORS } from '@app/store';

export const BINDING_EDIT_COMMON_SELECTORS = {
  canRequestPortValue: ({ hubId, portId, portModeName }: { hubId: string; portId: number; portModeName: PortModeName }) =>
    createSelector(
      HUB_RUNTIME_DATA_SELECTORS.selectIsHubConnected(hubId),
      HUB_RUNTIME_DATA_SELECTORS.isPortValueRequested({ hubId, portId }),
      ATTACHED_IO_SELECTORS.selectIoAtPort({ hubId, portId }),
      ATTACHED_IO_PORT_MODE_INFO_SELECTORS.selectHubPortInputModeForPortModeName({ hubId, portId, portModeName }),
      (isHubConnected, isPortValueRequested, io, modeInfo): boolean => {
        return isHubConnected && !isPortValueRequested && !!io && !!modeInfo;
      },
    ),
  canSetPortValue: ({ hubId, portId, portModeName }: { hubId: string; portId: number; portModeName: PortModeName }) =>
    createSelector(
      HUB_RUNTIME_DATA_SELECTORS.selectIsHubConnected(hubId),
      ATTACHED_IO_SELECTORS.selectIoAtPort({ hubId, portId }),
      ATTACHED_IO_PORT_MODE_INFO_SELECTORS.selectHubPortOutputModeForPortModeName({ hubId, portId, portModeName }),
      (isHubConnected, io, modeInfo): boolean => !!isHubConnected && !!io && !!modeInfo,
    ),
} as const;
