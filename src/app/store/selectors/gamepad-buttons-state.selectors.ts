import { createFeatureSelector, createSelector } from '@ngrx/store';
import { IState } from '../i-state';
import { GAMEPAD_BUTTONS_STATES_ENTITY_ADAPTER } from '../entity-adapters';

const GAMEPAD_BUTTONS_STATE_FEATURE_SELECTOR = createFeatureSelector<IState['gamepadButtonsState']>('gamepadButtonsState');

const GAMEPAD_BUTTONS_STATE_ENTITY_SELECTORS = GAMEPAD_BUTTONS_STATES_ENTITY_ADAPTER.getSelectors();

const GAMEPAD_BUTTONS_STATE_SELECT_ALL = createSelector(GAMEPAD_BUTTONS_STATE_FEATURE_SELECTOR, GAMEPAD_BUTTONS_STATE_ENTITY_SELECTORS.selectAll);

export const GAMEPAD_BUTTONS_STATE_SELECTORS = {
    selectAll: GAMEPAD_BUTTONS_STATE_SELECT_ALL,
} as const;
