import { createFeatureSelector, createSelector } from '@ngrx/store';
import { IState } from '../i-state';

const CONTROLLER_INPUT_CAPTURE_FEATURE_SELECTOR = createFeatureSelector<IState['controllerInputCapture']>('controllerInputCapture');

export const CONTROLLER_INPUT_CAPTURE_SELECTORS = {
    listenersCount: createSelector(
        CONTROLLER_INPUT_CAPTURE_FEATURE_SELECTOR,
        (state) => state.listenersCount
    ),
    isCapturing: createSelector(
        CONTROLLER_INPUT_CAPTURE_FEATURE_SELECTOR,
        (state) => state.listenersCount > 0
    )
} as const;
