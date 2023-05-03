import { createFeatureSelector, createSelector } from '@ngrx/store';
import { IState } from '../i-state';
import { HUBS_SELECTORS } from './hubs.selectors';
import { GAMEPAD_SELECTORS } from './gamepad.selectors';

const CONTROL_SCHEME_CONFIGURATION_STATE_FEATURE_SELECTOR = createFeatureSelector<IState['controlSchemeConfigurationState']>('controlSchemeConfigurationState');

export const CONTROL_SCHEME_CONFIGURATION_STATE_SELECTORS = {
    canAddBinding: createSelector(
        CONTROL_SCHEME_CONFIGURATION_STATE_FEATURE_SELECTOR,
        HUBS_SELECTORS.selectHubs,
        GAMEPAD_SELECTORS.selectAll,
        (state, hubs, gamepads) => !state.isListening && hubs.length > 0 && gamepads.length > 0
    ),
    canCancelBinding: createSelector(CONTROL_SCHEME_CONFIGURATION_STATE_FEATURE_SELECTOR, (state) => state.isListening),
    shouldShowBindingHelp: createSelector(CONTROL_SCHEME_CONFIGURATION_STATE_FEATURE_SELECTOR, (state) => state.isListening),
};
