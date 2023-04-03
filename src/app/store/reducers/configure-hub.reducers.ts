import { createReducer, on } from '@ngrx/store';
import { INITIAL_STATE } from '../initial-state';
import { ACTIONS_CONFIGURE_HUB } from '../actions';
import { HubConnectionState } from '../i-state';

export const CONFIGURE_HUB_REDUCERS = createReducer(
    INITIAL_STATE['hub'],
    on(ACTIONS_CONFIGURE_HUB.connected, (state) => ({ ...state, connectionState: HubConnectionState.Connected })),
    on(ACTIONS_CONFIGURE_HUB.connecting, (state) => ({ ...state, connectionState: HubConnectionState.Connecting })),
    on(ACTIONS_CONFIGURE_HUB.userRequestedHubDisconnection, (state) => ({ ...state, connectionState: HubConnectionState.Disconnecting })),
    on(ACTIONS_CONFIGURE_HUB.disconnected, (state) => ({
        ...state,
        connectionState: HubConnectionState.NotConnected,
        batteryLevel: null,
        rssiLevel: null,
        name: null,
        attachedIOs: {}
    })),
    on(ACTIONS_CONFIGURE_HUB.batteryLevelUpdate, (state, data) => ({ ...state, batteryLevel: data.batteryLevel })),
    on(ACTIONS_CONFIGURE_HUB.rssiLevelUpdate, (state, data) => ({ ...state, rssiLevel: data.rssiLevel })),
    on(ACTIONS_CONFIGURE_HUB.registerio, (state, data) => ({
        ...state,
        attachedIOs: {
            ...state.attachedIOs,
            [data.portId]: { ioType: data.ioType, value: [], modesInformation: null }
        }
    })),
    on(ACTIONS_CONFIGURE_HUB.unregisterio, (state, data) => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { [data.portId]: _, ...remainingIOs } = state.attachedIOs;
            return { ...state, attachedIOs: remainingIOs };
        }
    ),
    on(ACTIONS_CONFIGURE_HUB.portValueUpdate, (state, data) => ({
        ...state,
        attachedIOs: {
            ...state.attachedIOs,
            [data.portId]: {
                ...state.attachedIOs[data.portId],
                value: data.value
            }
        }
    })),
    on(ACTIONS_CONFIGURE_HUB.portModeInformationUpdate, (state, data) => ({
        ...state,
        attachedIOs: {
            ...state.attachedIOs,
            [data.portId]: {
                ...state.attachedIOs[data.portId],
                modesInformation: data.modesInformation
            }
        }
    }))
);
