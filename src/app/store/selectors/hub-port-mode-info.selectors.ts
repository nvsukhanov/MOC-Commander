import { createFeatureSelector, createSelector } from '@ngrx/store';
import { IOType, PortModeName } from '@nvsukhanov/rxpoweredup';

import { IState } from '../i-state';
import { HUB_PORT_MODE_INFO, hubPortModeInfoIdFn } from '../entity-adapters';
import { HUB_IO_SUPPORTED_MODES_SELECTORS } from './hub-io-supported-modes.selectors';

const HUB_PORT_MODE_FEATURE_SELECTOR = createFeatureSelector<IState['hubPortModeInfo']>('hubPortModeInfo');

const HUB_PORT_MODE_INFO_ENTITY_ADAPTER_SELECTORS = HUB_PORT_MODE_INFO.getSelectors();

export const HUB_PORT_MODE_INFO_SELECTORS = {
    selectAll: createSelector(HUB_PORT_MODE_FEATURE_SELECTOR, HUB_PORT_MODE_INFO_ENTITY_ADAPTER_SELECTORS.selectAll),
    selectEntities: createSelector(HUB_PORT_MODE_FEATURE_SELECTOR, HUB_PORT_MODE_INFO_ENTITY_ADAPTER_SELECTORS.selectEntities),
    hasCachedPortModeInfo: (hardwareRevision: string, softwareRevision: string, ioType: IOType) => createSelector(
        HUB_IO_SUPPORTED_MODES_SELECTORS.selectIOPortModes(hardwareRevision, softwareRevision, ioType),
        HUB_PORT_MODE_INFO_SELECTORS.selectEntities,
        (ioPortModes, portModeInfo) => {
            const hasFullInputModesInfo = ioPortModes?.portInputModes.every((modeId) => {
                const portModeInfoForMode = portModeInfo[hubPortModeInfoIdFn({ hardwareRevision, softwareRevision, modeId, ioType })];
                return portModeInfoForMode !== undefined;
            }) ?? false;
            const hasFullOutputModesInfo = ioPortModes?.portOutputModes.every((modeId) => {
                const portModeInfoForMode = portModeInfo[hubPortModeInfoIdFn({ hardwareRevision, softwareRevision, modeId, ioType })];
                return portModeInfoForMode !== undefined;
            }) ?? false;
            return hasFullInputModesInfo && hasFullOutputModesInfo;
        }
    ),
    selectModeIdForInputModeName: (hardwareRevision: string, softwareRevision: string, ioType: IOType, portModeName: PortModeName) => createSelector(
        HUB_IO_SUPPORTED_MODES_SELECTORS.selectIOPortModes(hardwareRevision, softwareRevision, ioType),
        HUB_PORT_MODE_INFO_SELECTORS.selectEntities,
        (ioPortModes, portModeInfo): number | null => {
            return ioPortModes?.portInputModes.find((modeId) => {
                return portModeInfo[hubPortModeInfoIdFn({ hardwareRevision, softwareRevision, modeId, ioType })]?.name === portModeName;
            }) ?? null;
        }
    ),
} as const;
