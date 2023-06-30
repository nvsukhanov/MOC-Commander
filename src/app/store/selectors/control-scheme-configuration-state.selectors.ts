import { createFeatureSelector, createSelector } from '@ngrx/store';

import { IState } from '../i-state';
import { HUBS_SELECTORS } from './hubs.selectors';
import { CONTROLLER_SELECTORS } from '../controllers';

const CONTROL_SCHEME_CONFIGURATION_STATE_FEATURE_SELECTOR = createFeatureSelector<IState['controlSchemeConfigurationState']>('controlSchemeConfigurationState');

export const CONTROL_SCHEME_CONFIGURATION_STATE_SELECTORS = {
    canAddBinding: createSelector(
        CONTROL_SCHEME_CONFIGURATION_STATE_FEATURE_SELECTOR,
        HUBS_SELECTORS.selectHubs,
        CONTROLLER_SELECTORS.selectAll,
        (state, hubs, controllers) => !state.isListening && hubs.length > 0 && controllers.length > 0
    ),
    isListening: createSelector(CONTROL_SCHEME_CONFIGURATION_STATE_FEATURE_SELECTOR, (state) => state.isListening),
    shouldShowBindingHelp: createSelector(CONTROL_SCHEME_CONFIGURATION_STATE_FEATURE_SELECTOR, (state) => state.isListening),
};
