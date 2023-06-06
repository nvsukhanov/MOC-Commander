import { createReducer, on } from '@ngrx/store';

import { INITIAL_STATE } from '../initial-state';
import { HUBS_ACTIONS } from '../actions';
import { HubDiscoveryState, IState } from '../i-state';

export const HUB_DISCOVERY_STATE_REDUCER = createReducer(
    INITIAL_STATE.hubDiscoveryState,
    on(HUBS_ACTIONS.startDiscovery, (state): IState['hubDiscoveryState'] => ({
        ...state,
        discoveryState: HubDiscoveryState.Discovering
    })),
    on(
        HUBS_ACTIONS.connected,
        HUBS_ACTIONS.deviceConnectFailed,
        (state): IState['hubDiscoveryState'] => ({
            ...state,
            discoveryState: HubDiscoveryState.Idle
        })
    ),
);
