/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { HUB_ATTACHED_IOS_ENTITY_ADAPTER, hubIOSupportedModesIdFn, hubPortModeInfoIdFn } from '../entity-adapters';
import { GamepadInputMethod, IState } from '../i-state';
import { HUB_IO_SUPPORTED_MODES_SELECTORS } from './hub-io-supported-modes.selectors';
import { HUB_IO_CONTROL_METHODS } from '../hub-io-control-methods';
import { HUB_PORT_MODE_INFO_SELECTORS } from './hub-port-mode-info.selectors';

const SELECT_HUB_ATTACHED_IOS_FEATURE = createFeatureSelector<IState['hubAttachedIOs']>('hubAttachedIOs');

const HUB_ATTACHED_IOS_ADAPTER_SELECTORS = HUB_ATTACHED_IOS_ENTITY_ADAPTER.getSelectors();

export const HUB_ATTACHED_IO_SELECTORS = {
    selectIOsAll: createSelector(SELECT_HUB_ATTACHED_IOS_FEATURE, HUB_ATTACHED_IOS_ADAPTER_SELECTORS.selectAll),
    selectHubIOs: (hubId: string) => createSelector(
        HUB_ATTACHED_IO_SELECTORS.selectIOsAll,
        (ios) => ios.filter((io) => io.hubId === hubId)
    ),
    selectFirstIOControllableByMethod: (hubId: string, inputMethod: GamepadInputMethod) => createSelector(
        HUB_ATTACHED_IO_SELECTORS.selectHubIOs(hubId),
        HUB_IO_SUPPORTED_MODES_SELECTORS.selectIOSupportedModesRecord,
        HUB_PORT_MODE_INFO_SELECTORS.selectEntities,
        (ios, supportedModes, portModeData) => {
            const applicablePortModes = new Set(HUB_IO_CONTROL_METHODS[inputMethod]);
            for (const io of ios) {
                const outputModes = supportedModes[hubIOSupportedModesIdFn(io.hardwareRevision, io.softwareRevision, io.ioType)]?.portOutputModes;

                if (outputModes && outputModes.length > 0) {
                    for (const modeId of outputModes) {
                        const portModeId = hubPortModeInfoIdFn(io.hardwareRevision, io.softwareRevision, modeId, io.ioType);
                        const portModeInfo = portModeData[portModeId];
                        if (portModeInfo && applicablePortModes.has(portModeInfo.name)) {
                            return {
                                portId: io.portId,
                                portModeId: portModeInfo.modeId,
                            };
                        }
                    }
                }
            }
            return undefined;
        }
    )
} as const;
