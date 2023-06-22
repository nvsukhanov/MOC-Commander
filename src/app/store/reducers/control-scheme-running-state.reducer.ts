import { createReducer, on } from '@ngrx/store';

import { INITIAL_STATE } from '../initial-state';
import { CONTROL_SCHEME_ACTIONS } from '../actions';
import { ControlSchemeRunStage, IState } from '../i-state';

export const CONTROL_SCHEME_RUNNING_STATE_REDUCER = createReducer(
    INITIAL_STATE['controlSchemeRunningState'],
    on(CONTROL_SCHEME_ACTIONS.startScheme,
        (state, { schemeId }): IState['controlSchemeRunningState'] => ({
            ...state,
            runningSchemeId: schemeId,
            stage: ControlSchemeRunStage.Preparing
        })
    ),
    on(CONTROL_SCHEME_ACTIONS.schemeStarted,
        (state): IState['controlSchemeRunningState'] => ({
            ...state,
            stage: ControlSchemeRunStage.Running
        })
    ),
    on(CONTROL_SCHEME_ACTIONS.schemeStartError,
        CONTROL_SCHEME_ACTIONS.schemeStopped,
        CONTROL_SCHEME_ACTIONS.schemeStopError,
        (state): IState['controlSchemeRunningState'] => ({
            ...state,
            runningSchemeId: null,
            stage: ControlSchemeRunStage.Idle
        })
    ),
    on(CONTROL_SCHEME_ACTIONS.stopScheme,
        (state): IState['controlSchemeRunningState'] => ({
            ...state,
            stage: ControlSchemeRunStage.Cleanup
        })
    )
);
