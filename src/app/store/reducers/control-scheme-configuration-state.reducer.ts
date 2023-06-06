/* eslint-disable @ngrx/on-function-explicit-return-type */
import { createReducer, on } from '@ngrx/store';

import { INITIAL_STATE } from '../initial-state';
import { CONTROL_SCHEME_CONFIGURATION_ACTIONS } from '../actions';
import { IState } from '../i-state';

export const CONTROL_SCHEME_CONFIGURATION_STATE_REDUCER = createReducer(
    INITIAL_STATE['controlSchemeConfigurationState'],
    on(CONTROL_SCHEME_CONFIGURATION_ACTIONS.startListening, (state): IState['controlSchemeConfigurationState'] => ({ ...state, isListening: true })),
    on(CONTROL_SCHEME_CONFIGURATION_ACTIONS.stopListening, (state): IState['controlSchemeConfigurationState'] => ({ ...state, isListening: false }))
);
