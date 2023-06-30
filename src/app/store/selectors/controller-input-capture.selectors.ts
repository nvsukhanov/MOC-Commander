import { createFeatureSelector, createSelector } from '@ngrx/store';

import { IState } from '../i-state';
import { CONTROLLER_SELECTORS } from '../controllers';

const CONTROLLER_INPUT_CAPTURE_FEATURE_SELECTOR = createFeatureSelector<IState['controllerInputCapture']>('controllerInputCapture');

export const CONTROLLER_INPUT_CAPTURE_SELECTORS = {
    listenersCount: createSelector(
        CONTROLLER_INPUT_CAPTURE_FEATURE_SELECTOR,
        (state) => state.listenersCount
    ),
    isCapturing: createSelector(
        CONTROLLER_INPUT_CAPTURE_FEATURE_SELECTOR,
        (state) => state.listenersCount > 0
    ),
    isKeyboardBeingCaptured: createSelector(
        CONTROLLER_INPUT_CAPTURE_FEATURE_SELECTOR,
        CONTROLLER_SELECTORS.hasKeyboardConnected,
        (state, hasKeyboardConnected) => state.listenersCount > 0 && hasKeyboardConnected
    )
} as const;
