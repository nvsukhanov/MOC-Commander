import { createFeatureSelector, createSelector } from '@ngrx/store';
import { IState } from '../i-state';
import { GAMEPADS_ENTITY_ADAPTER } from '../entity-adapters';

const GAMEPAD_FEATURE_SELECTOR = createFeatureSelector<IState['gamepads']>('gamepads');

const GAMEPAD_ENTITY_SELECTORS = GAMEPADS_ENTITY_ADAPTER.getSelectors();

export const GAMEPAD_SELECTORS = {
    selectAll: createSelector(GAMEPAD_FEATURE_SELECTOR, GAMEPAD_ENTITY_SELECTORS.selectAll)
} as const;
