import { HUB_IO_DATA_ENTITY_ADAPTER } from '../entity-adapters';
import { createReducer, on } from '@ngrx/store';
import { HUBS_ACTIONS } from '../actions';

export const HUB_IO_DATA_REDUCERS = createReducer(
    HUB_IO_DATA_ENTITY_ADAPTER.getInitialState(),
    on(HUBS_ACTIONS.disconnected, (state, data) => HUB_IO_DATA_ENTITY_ADAPTER.removeMany((d) => d.hubId === data.hubId, state))
);
