/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { IState } from '../i-state';
import { ATTACHED_ENTITY_SELECTORS } from '../entity-adapters';
import { PortModeName } from '../../lego-hub';

export const SELECT_HUB_FEATURE = createFeatureSelector<IState['hub']>('hub');

export const SELECT_HUB_CONNECTION_STATE = createSelector(
    SELECT_HUB_FEATURE,
    (state) => state.connectionState
);

export const SELECT_HUB_BATTERY_LEVEL = createSelector(
    SELECT_HUB_FEATURE,
    (state) => state.batteryLevel
);

export const SELECT_HUB_RSSI_LEVEL = createSelector(
    SELECT_HUB_FEATURE,
    (state) => state.rssiLevel
);

const SELECT_ATTACHED_IOS_ENTITY = createSelector(
    SELECT_HUB_FEATURE,
    (state) => state.attachedIOs
);

export const SELECT_ATTACHED_IOS = createSelector(
    SELECT_ATTACHED_IOS_ENTITY,
    ATTACHED_ENTITY_SELECTORS.selectEntities
);

export const SELECT_ATTACHED_IOS_LIST = createSelector(
    SELECT_ATTACHED_IOS_ENTITY,
    ATTACHED_ENTITY_SELECTORS.selectAll
);

export const SELECT_IO_PORT_CONFIG = createSelector(
    SELECT_ATTACHED_IOS_LIST,
    (state) => state.map((ioConfig) => {
        return {
            type: ioConfig.ioType,
            config: {
                portId: ioConfig.portId,
                inputModes: ioConfig.availableInputModes,
                outputModes: ioConfig.availableOutputModes,
                value: ioConfig.value,
                currentMode: ioConfig.currentInputPortMode,
            }
        };
    })
);

export const SELECT_PORT_CONFIG = (portId: number) => createSelector(
    SELECT_ATTACHED_IOS,
    (state) => state[portId]
);

export const SELECT_PORT_CURRENT_MODE = (portId: number) => createSelector(
    SELECT_PORT_CONFIG(portId),
    (state) => state?.currentInputPortMode ?? null
);

export const SELECT_PORT_AVAILABLE_INPUT_MODE_MAP = (portId: number) => createSelector(
    SELECT_PORT_CONFIG(portId),
    (state) => {
        const result: { [s in PortModeName]?: number } = {};
        if (state) {
            for (const mode in state.availableInputModes) {
                result[state.availableInputModes[mode].name] = Number(mode);
            }
        }
        return result;
    }
);
