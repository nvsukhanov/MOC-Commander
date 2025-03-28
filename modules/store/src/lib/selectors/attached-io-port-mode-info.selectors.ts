import { createSelector } from '@ngrx/store';
import { IOType, PortModeName } from 'rxpoweredup';

import { ATTACHED_IO_MODES_SELECTORS } from './attached-io-modes.selectors';
import { ATTACHED_IO_SELECTORS } from './attached-ios.selectors';
import { ATTACHED_IO_PORT_MODE_INFO_ENTITY_ADAPTER, ATTACHED_IO_PORT_MODE_INFO_FEATURE, attachedIoModesIdFn, attachedIoPortModeInfoIdFn } from '../reducers';
import { HUB_RUNTIME_DATA_SELECTORS } from './hub-runtime-data.selectors';

export const ATTACHED_IO_PORT_MODE_INFO_SELECTORS = {
  selectAll: createSelector(
    ATTACHED_IO_PORT_MODE_INFO_FEATURE.selectAttachedIoPortModeInfoState,
    ATTACHED_IO_PORT_MODE_INFO_ENTITY_ADAPTER.getSelectors().selectAll,
  ),
  selectEntities: createSelector(
    ATTACHED_IO_PORT_MODE_INFO_FEATURE.selectAttachedIoPortModeInfoState,
    ATTACHED_IO_PORT_MODE_INFO_ENTITY_ADAPTER.getSelectors().selectEntities,
  ),
  selectModeIdForIoAndPortModeName: (
    { hardwareRevision, softwareRevision, ioType }: { hardwareRevision: string; softwareRevision: string; ioType: IOType },
    portModeName: PortModeName,
  ) =>
    createSelector(
      ATTACHED_IO_MODES_SELECTORS.selectIoPortModes({ hardwareRevision, softwareRevision, ioType }),
      ATTACHED_IO_PORT_MODE_INFO_SELECTORS.selectEntities,
      (ioPortModes, portModeInfo): number | null => {
        return (
          ioPortModes?.portInputModes.find((modeId) => {
            return portModeInfo[attachedIoPortModeInfoIdFn({ hardwareRevision, softwareRevision, ioType, modeId })]?.name === portModeName;
          }) ?? null
        );
      },
    ),
  selectHubPortInputModeForPortModeName: ({ hubId, portId, portModeName }: { hubId: string; portId: number; portModeName: PortModeName }) =>
    createSelector(
      ATTACHED_IO_SELECTORS.selectIoAtPort({ hubId, portId }),
      ATTACHED_IO_MODES_SELECTORS.selectEntities,
      ATTACHED_IO_PORT_MODE_INFO_SELECTORS.selectEntities,
      (io, supportedModes, portModeData) => {
        if (io) {
          const supportedInputModes = new Set(supportedModes[attachedIoModesIdFn(io)]?.portInputModes ?? []);
          if (supportedInputModes) {
            return (
              Object.values(portModeData).find((portModeInfo) => {
                return portModeInfo?.name === portModeName && supportedInputModes.has(portModeInfo?.modeId);
              }) ?? null
            );
          }
        }
        return null;
      },
    ),
  selectHubPortOutputModeForPortModeName: ({ hubId, portId, portModeName }: { hubId: string; portId: number; portModeName: PortModeName }) =>
    createSelector(
      ATTACHED_IO_SELECTORS.selectIoAtPort({ hubId, portId }),
      ATTACHED_IO_MODES_SELECTORS.selectEntities,
      ATTACHED_IO_PORT_MODE_INFO_SELECTORS.selectEntities,
      (io, supportedModes, portModeData) => {
        if (io) {
          const supportedOutputModes = new Set(supportedModes[attachedIoModesIdFn(io)]?.portOutputModes ?? []);
          if (supportedOutputModes) {
            return (
              Object.values(portModeData).find((portModeInfo) => {
                return portModeInfo?.name === portModeName && supportedOutputModes.has(portModeInfo?.modeId);
              }) ?? null
            );
          }
        }
        return null;
      },
    ),
  selectIsIoSupportInputMode: ({ hubId, portId, portModeName }: { hubId: string; portId: number; portModeName: PortModeName }) =>
    createSelector(
      HUB_RUNTIME_DATA_SELECTORS.selectIsHubConnected(hubId),
      ATTACHED_IO_SELECTORS.selectIoAtPort({ hubId, portId }),
      ATTACHED_IO_PORT_MODE_INFO_SELECTORS.selectHubPortOutputModeForPortModeName({ hubId, portId, portModeName }),
      (hubIsConnected, io, outputMode) => hubIsConnected && !!io && outputMode !== null,
    ),
  selectIoOutputPortModeNames: ({ hubId, portId }: { hubId: string; portId: number }) =>
    createSelector(
      ATTACHED_IO_SELECTORS.selectIoAtPort({ hubId, portId }),
      ATTACHED_IO_MODES_SELECTORS.selectEntities,
      ATTACHED_IO_PORT_MODE_INFO_SELECTORS.selectEntities,
      (io, supportedModes, portModeData) => {
        if (!io) {
          return [];
        }
        const ioOutputModeIds = supportedModes[attachedIoModesIdFn(io)]?.portOutputModes ?? [];
        return ioOutputModeIds
          .map((modeId) => portModeData[attachedIoPortModeInfoIdFn({ ...io, modeId })]?.name)
          .filter((modeName): modeName is PortModeName => modeName !== undefined);
      },
    ),
} as const;
