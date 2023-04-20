import { createReducer, on } from '@ngrx/store';
import { CONTROL_SCHEMES_ENTITY_ADAPTER } from '../entity-adapters';
import { CONTROL_SCHEME_ACTIONS } from '../actions';

export const CONTROL_SCHEME_REDUCERS = createReducer(
    CONTROL_SCHEMES_ENTITY_ADAPTER.getInitialState(),
    on(CONTROL_SCHEME_ACTIONS.create, (state, { id, name, bindings }) => {
        const nextIndex = Math.max(0, ...Object.values(state.entities).map((entity) => entity?.index ?? 0)) + 1;
        return CONTROL_SCHEMES_ENTITY_ADAPTER.addOne({
            id,
            name,
            index: nextIndex,
            bindings
        }, state);
    })
);
