import { createFeatureSelector, createSelector } from '@ngrx/store';
import { IState } from '../i-state';
import { ATTACHED_ENTITY_SELECTORS } from '../entity-adapters';

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

export const SELECT_ATTACHED_IOS = createSelector(
    SELECT_HUB_FEATURE,
    (state) => state.attachedIOs
);

export const SELECT_ATTACHED_IOS_LIST = createSelector(
    SELECT_ATTACHED_IOS,
    ATTACHED_ENTITY_SELECTORS.selectAll
);

export const SELECT_IO_PORT_CONFIG = createSelector(
    SELECT_ATTACHED_IOS_LIST,
    (state) => state.map((ioConfig) => {
        return {
            type: ioConfig.ioType,
            config: {
                portId: ioConfig.portId,
                inputModes: ioConfig.inputModes,
                outputModes: ioConfig.outputModes,
                value: ioConfig.value
            }
        };
    })
);
