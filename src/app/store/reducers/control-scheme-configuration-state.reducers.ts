/* eslint-disable @ngrx/on-function-explicit-return-type */
import { createReducer, on } from '@ngrx/store';
import { INITIAL_STATE } from '../initial-state';
import { CONTROL_SCHEME_CONFIGURATION_ACTIONS } from '../actions';

export const CONTROL_SCHEME_CONFIGURATION_STATE_REDUCERS = createReducer(
    INITIAL_STATE['controlSchemeConfigurationState'],
    on(CONTROL_SCHEME_CONFIGURATION_ACTIONS.startListening, (state) => ({ ...state, isListening: true })),
    on(CONTROL_SCHEME_CONFIGURATION_ACTIONS.stopListening, (state) => ({ ...state, isListening: false }))
);
