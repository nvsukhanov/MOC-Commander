import { createFeatureSelector, createSelector } from '@ngrx/store';
import { IState } from '../i-state';
import { GAMEPAD_BUTTONS_STATES_ENTITY_ADAPTER, gamepadButtonIdFn } from '../entity-adapters';

const GAMEPAD_BUTTONS_STATE_FEATURE_SELECTOR = createFeatureSelector<IState['gamepadButtonsState']>('gamepadButtonsState');

const GAMEPAD_BUTTONS_STATE_ENTITY_SELECTORS = GAMEPAD_BUTTONS_STATES_ENTITY_ADAPTER.getSelectors();

export const GAMEPAD_BUTTONS_STATE_SELECTORS = {
    selectAll: createSelector(GAMEPAD_BUTTONS_STATE_FEATURE_SELECTOR, GAMEPAD_BUTTONS_STATE_ENTITY_SELECTORS.selectAll),
    selectEntities: createSelector(GAMEPAD_BUTTONS_STATE_FEATURE_SELECTOR, GAMEPAD_BUTTONS_STATE_ENTITY_SELECTORS.selectEntities),
    selectByIndex: (gamepadIndex: number, buttonIndex: number) => createSelector(
        GAMEPAD_BUTTONS_STATE_SELECTORS.selectEntities,
        (state) => state[gamepadButtonIdFn(gamepadIndex, buttonIndex)]
    ),
} as const;
