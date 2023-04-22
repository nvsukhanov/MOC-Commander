/* eslint-disable @ngrx/on-function-explicit-return-type */
import { createReducer, on } from '@ngrx/store';
import { INITIAL_STATE } from '../initial-state';
import { CONTROL_SCHEME_ACTIONS } from '../actions';

export const CONTROL_SCHEME_RUNNER_REDUCERS = createReducer(
    INITIAL_STATE['controlSchemeRunningState'],
    on(CONTROL_SCHEME_ACTIONS.markSchemeAsRunning, (state, { schemeId }) => ({ ...state, runSchemeId: schemeId })),
    on(CONTROL_SCHEME_ACTIONS.stopRunning, (state) => ({ ...state, runSchemeId: null })),
);
