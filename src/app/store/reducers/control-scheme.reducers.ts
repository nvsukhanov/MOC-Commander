import { createReducer, on } from '@ngrx/store';
import { CONTROL_SCHEMES_ENTITY_ADAPTER } from '../entity-adapters';
import { CONTROL_SCHEME_ACTIONS } from '../actions';

export const CONTROL_SCHEME_REDUCERS = createReducer(
    CONTROL_SCHEMES_ENTITY_ADAPTER.getInitialState(),
    on(CONTROL_SCHEME_ACTIONS.create, (state) => CONTROL_SCHEMES_ENTITY_ADAPTER.addOne({
        name: `Scheme ${Math.max(0, ...Object.keys(state.entities).map(id => parseInt(id, 10))) + 1}`,
        id: (Math.max(0, ...Object.keys(state.entities).map(id => parseInt(id, 10))) + 1).toString()
    }, state)),
    on(CONTROL_SCHEME_ACTIONS.delete, (state, { id }) => CONTROL_SCHEMES_ENTITY_ADAPTER.removeOne(id, state))
);
