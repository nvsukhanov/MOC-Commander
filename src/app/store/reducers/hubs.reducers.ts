import { createReducer, on } from '@ngrx/store';
import { HUBS_ENTITY_ADAPTER } from '../entity-adapters';
import { HUBS_ACTIONS } from '../actions';

export const HUBS_REDUCERS = createReducer(
    HUBS_ENTITY_ADAPTER.getInitialState(),
    on(HUBS_ACTIONS.connected,
        (state, data) => HUBS_ENTITY_ADAPTER.addOne({
            hubId: data.hubId,
            name: data.name,
            batteryLevel: null,
            rssiLevel: null,
        }, state)),
    on(HUBS_ACTIONS.disconnected,
        HUBS_ACTIONS.userRequestedHubDisconnection,
        (state, data) => HUBS_ENTITY_ADAPTER.removeOne(data.hubId, state)
    ),
    on(HUBS_ACTIONS.batteryLevelReceived, (state, data) => HUBS_ENTITY_ADAPTER.updateOne({
            id: data.hubId,
            changes: {
                batteryLevel: data.batteryLevel,
            }
        },
        state
    )),
    on(HUBS_ACTIONS.rssiLevelReceived, (state, data) => HUBS_ENTITY_ADAPTER.updateOne({
            id: data.hubId,
            changes: {
                rssiLevel: data.rssiLevel,
            }
        },
        state
    )),
);
