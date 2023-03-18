import { createReducer, on } from '@ngrx/store';
import { INITIAL_STATE } from '../initial-state';
import { ACTION_CONFIGURE_HUB_TERMINATION, ACTIONS_CONFIGURE_HUB } from '../actions';
import { HubConnectionState, IState } from '../i-state';

export const CONFIGURE_HUB_REDUCERS = createReducer(
    INITIAL_STATE['hub'],
    on(ACTIONS_CONFIGURE_HUB.deviceConnected, (state) => ({ ...state, connectionState: HubConnectionState.Connected })),
    on(
        ...ACTION_CONFIGURE_HUB_TERMINATION,
        (state: IState['hub']) => ({ ...state, connectionState: HubConnectionState.NotConnected })
    )
);
