/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { IState } from '../i-state';

const CONTROL_SCHEME_RUNNING_STATE_FEATURE_SELECTOR = createFeatureSelector<IState['controlSchemeRunningState']>('controlSchemeRunningState');

export const CONTROL_SCHEME_RUNNING_STATE_SELECTORS = {
    selectRunningSchemeId: createSelector(
        CONTROL_SCHEME_RUNNING_STATE_FEATURE_SELECTOR,
        (state) => state.runningSchemeId
    ),
    selectIsAnySchemeRunning: createSelector(
        CONTROL_SCHEME_RUNNING_STATE_FEATURE_SELECTOR,
        (state) => state.runningSchemeId !== null
    ),

} as const;
