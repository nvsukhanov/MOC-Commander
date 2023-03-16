import { createReducer } from '@ngrx/store';
import { INITIAL_STATE } from '../initial-state';

export const CONFIGURE_HUB_REDUCERS = createReducer(
    INITIAL_STATE['hub']
);
