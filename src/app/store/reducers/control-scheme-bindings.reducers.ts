import { createReducer } from '@ngrx/store';
import { CONTROL_SCHEME_BINDING_ADAPTER } from '../entity-adapters';

export const CONTROL_SCHEME_BINDINGS_REDUCERS = createReducer(
    CONTROL_SCHEME_BINDING_ADAPTER.getInitialState(),
);
