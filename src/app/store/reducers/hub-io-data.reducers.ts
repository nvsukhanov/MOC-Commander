import { HUB_IO_DATA_ENTITY_ADAPTER, hubIODataIdFn } from '../entity-adapters';
import { createReducer, on } from '@ngrx/store';
import { HUB_IO_DATA_ACTIONS, HUBS_ACTIONS } from '../actions';

export const HUB_IO_DATA_REDUCERS = createReducer(
    HUB_IO_DATA_ENTITY_ADAPTER.getInitialState(),
    on(HUB_IO_DATA_ACTIONS.updatePortValue, (state, data) => HUB_IO_DATA_ENTITY_ADAPTER.updateOne({
            id: hubIODataIdFn(data.hubId, data.portId),
            changes: {
                values: data.value
            },
        },
        state
    )),
    on(HUBS_ACTIONS.disconnected, (state, data) => HUB_IO_DATA_ENTITY_ADAPTER.removeMany((d) => d.hubId === data.hubId, state))
);
