import { createFeatureSelector, createSelector } from '@ngrx/store';
import { IState } from '../i-state';
import { IIoPortRendererConfig } from '../../configure-hub/io-port/i-io-port-renderer';

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

export const SELECT_IO_PORT_CONFIG = createSelector(  // TODO: use ngrx entity
    SELECT_ATTACHED_IOS,
    (state) => [ ...Object.entries(state) ].map(([ portId, ioConfig ]) => {
        return {
            type: ioConfig.ioType,
            config: {
                portId: Number(portId), // TODO: Remove this hack
                inputModes: ioConfig.inputModes,
                outputModes: ioConfig.outputModes,
                value: ioConfig.value
            } as IIoPortRendererConfig
        };
    })
);
