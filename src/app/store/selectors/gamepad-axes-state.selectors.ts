import { createFeatureSelector, createSelector } from '@ngrx/store';
import { IState } from '../i-state';
import { GAMEPAD_AXES_STATES_ENTITY_ADAPTER } from '../entity-adapters';

const GAMEPAD_AXES_STATE_FEATURE_SELECTOR = createFeatureSelector<IState['gamepadAxesState']>('gamepadAxesState');

const GAMEPAD_AXES_STATE_ENTITY_SELECTORS = GAMEPAD_AXES_STATES_ENTITY_ADAPTER.getSelectors();

const GAMEPAD_AXES_STATE_SELECT_ALL = createSelector(GAMEPAD_AXES_STATE_FEATURE_SELECTOR, GAMEPAD_AXES_STATE_ENTITY_SELECTORS.selectAll);

export const GAMEPAD_AXES_STATE_SELECTORS = {
    selectAll: GAMEPAD_AXES_STATE_SELECT_ALL,
} as const;
