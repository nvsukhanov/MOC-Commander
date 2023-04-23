import { createReducer, on } from '@ngrx/store';
import { INITIAL_STATE } from '../initial-state';
import { CONTROL_SCHEME_ACTIONS } from '../actions';
import { IState } from '../i-state';

export const CONTROL_SCHEME_RUNNING_STATE_REDUCERS = createReducer(
    INITIAL_STATE['controlSchemeRunningState'],
    on(CONTROL_SCHEME_ACTIONS.markSchemeAsRunning, (state, { schemeId }): IState['controlSchemeRunningState'] => ({ ...state, runningSchemeId: schemeId })),
    on(CONTROL_SCHEME_ACTIONS.stopRunning, (state): IState['controlSchemeRunningState'] => ({ ...state, runningSchemeId: null })),
);
