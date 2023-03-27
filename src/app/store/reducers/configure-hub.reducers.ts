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
        name: null
    })),
    on(ACTIONS_CONFIGURE_HUB.batteryLevelUpdate, (state, data) => ({ ...state, batteryLevel: data.batteryLevel })),
    on(ACTIONS_CONFIGURE_HUB.rssiLevelUpdate, (state, data) => ({ ...state, rssiLevel: data.rssiLevel })),
    on(ACTIONS_CONFIGURE_HUB.nameUpdate, (state, data) => ({ ...state, name: data.name }))
);
