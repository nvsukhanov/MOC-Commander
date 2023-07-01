import { createSelector } from '@ngrx/store';
import { PortModeName } from '@nvsukhanov/rxpoweredup';

import { ATTACHED_IO_MODES_SELECTORS } from './attached-io-modes.selectors';
import { AttachedIoModel } from '../models';
import { ATTACHED_IO_SELECTORS } from './attached-ios.selectors';
import { ATTACHED_IO_PORT_MODE_INFO_ENTITY_ADAPTER, ATTACHED_IO_PORT_MODE_INFO_FEATURE, attachedIoModesIdFn, attachedIoPortModeInfoIdFn } from '../reducers';

export const ATTACHED_IO_PORT_MODE_INFO_SELECTORS = {
    selectAll: createSelector(
        ATTACHED_IO_PORT_MODE_INFO_FEATURE.selectAttachedIoPortModeInfoState,
        ATTACHED_IO_PORT_MODE_INFO_ENTITY_ADAPTER.getSelectors().selectAll
    ),
    selectEntities: createSelector(
        ATTACHED_IO_PORT_MODE_INFO_FEATURE.selectAttachedIoPortModeInfoState,
        ATTACHED_IO_PORT_MODE_INFO_ENTITY_ADAPTER.getSelectors().selectEntities
    ),
    selectModeIdForInputModeName: (io: AttachedIoModel, portModeName: PortModeName) => createSelector(
        ATTACHED_IO_MODES_SELECTORS.selectIoPortModes(io),
        ATTACHED_IO_PORT_MODE_INFO_SELECTORS.selectEntities,
        (ioPortModes, portModeInfo): number | null => {
            return ioPortModes?.portInputModes.find((modeId) => {
                return portModeInfo[attachedIoPortModeInfoIdFn({ ...io, modeId })]?.name === portModeName;
            }) ?? null;
        }
    ),
    selectHubPortInputModeForPortModeName: (hubId: string, portId: number, portModeName: PortModeName) => createSelector(
        ATTACHED_IO_SELECTORS.selectIoAtPort({ hubId, portId }),
        ATTACHED_IO_MODES_SELECTORS.selectEntities,
        ATTACHED_IO_PORT_MODE_INFO_SELECTORS.selectEntities,
        (io, supportedModes, portModeData) => {
            if (io) {
                const supportedInputModes = new Set(
                    supportedModes[attachedIoModesIdFn(io)]?.portInputModes ?? []
                );
                if (supportedInputModes) {
                    return Object.values(portModeData).find((portModeInfo) => {
                        return portModeInfo?.name === portModeName && supportedInputModes.has(portModeInfo?.modeId);
                    }) ?? null;
                }
            }
            return null;
        }
    ),
} as const;
