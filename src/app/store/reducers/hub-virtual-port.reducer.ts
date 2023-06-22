import { createReducer, on } from '@ngrx/store';

import { INITIAL_STATE } from '../initial-state';
import { HUB_VIRTUAL_PORT_ACTIONS } from '../actions';
import { HUB_VIRTUAL_PORT_ENTITY_ADAPTER, hubVirtualPortIdFn } from '../entity-adapters';

export const HUB_VIRTUAL_PORT_REDUCER = createReducer(
    INITIAL_STATE['hubVirtualPorts'],
    on(HUB_VIRTUAL_PORT_ACTIONS.virtualPortCreated, (state, data) => {
        return HUB_VIRTUAL_PORT_ENTITY_ADAPTER.addOne(data, state);
    }),
    on(HUB_VIRTUAL_PORT_ACTIONS.virtualPortDeleted, (state, data) => {
        return HUB_VIRTUAL_PORT_ENTITY_ADAPTER.removeOne(hubVirtualPortIdFn(data), state);
    })
);
