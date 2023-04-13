import { createFeatureSelector, createSelector } from '@ngrx/store';
import { IState } from '../i-state';

const CONTROL_SCHEME_CONFIGURATION_STATE_FEATURE_SELECTOR = createFeatureSelector<IState['controlSchemeConfigurationState']>('controlSchemeConfigurationState');

export const CONTROL_SCHEME_CONFIGURATION_STATE_SELECTORS = {
    canAddBinding: createSelector(CONTROL_SCHEME_CONFIGURATION_STATE_FEATURE_SELECTOR, (state) => !state.isListening),
    canCancelBinding: createSelector(CONTROL_SCHEME_CONFIGURATION_STATE_FEATURE_SELECTOR, (state) => state.isListening),
    shouldShowBindingHelp: createSelector(CONTROL_SCHEME_CONFIGURATION_STATE_FEATURE_SELECTOR, (state) => state.isListening),
};
