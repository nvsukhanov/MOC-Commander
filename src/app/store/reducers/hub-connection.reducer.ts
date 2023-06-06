import { createReducer, on } from '@ngrx/store';

import { INITIAL_STATE } from '../initial-state';
import { HUBS_ACTIONS } from '../actions';
import { HUB_CONNECTIONS_ENTITY_ADAPTER } from '../entity-adapters';
import { HubConnectionState, IState } from '../i-state';

export const HUB_CONNECTION_REDUCER = createReducer(
    INITIAL_STATE.hubConnections,
    on(HUBS_ACTIONS.connected, (state, { hubId }): IState['hubConnections'] =>
        HUB_CONNECTIONS_ENTITY_ADAPTER.upsertOne({ hubId, connectionState: HubConnectionState.Connected }, state)
    ),
    on(HUBS_ACTIONS.disconnected, (state, { hubId }): IState['hubConnections'] =>
        HUB_CONNECTIONS_ENTITY_ADAPTER.upsertOne({ hubId, connectionState: HubConnectionState.Disconnected }, state)
    ),
);
