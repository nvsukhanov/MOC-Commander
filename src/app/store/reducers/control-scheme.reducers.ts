import { createReducer, on } from '@ngrx/store';
import { CONTROL_SCHEMES_ENTITY_ADAPTER } from '../entity-adapters';
import { CONTROL_SCHEME_ACTIONS } from '../actions';

export const CONTROL_SCHEME_REDUCERS = createReducer(
    CONTROL_SCHEMES_ENTITY_ADAPTER.getInitialState(),
    on(CONTROL_SCHEME_ACTIONS.created, (state, data) => CONTROL_SCHEMES_ENTITY_ADAPTER.addOne(data, state)),
    on(CONTROL_SCHEME_ACTIONS.delete, (state, { id }) => CONTROL_SCHEMES_ENTITY_ADAPTER.removeOne(id, state))
);
