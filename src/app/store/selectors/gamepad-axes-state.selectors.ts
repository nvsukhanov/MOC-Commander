import { createFeatureSelector, createSelector } from '@ngrx/store';
import { IState } from '../i-state';
import { GAMEPAD_AXES_STATES_ENTITY_ADAPTER, gamepadAxisIdFn } from '../entity-adapters';

const GAMEPAD_AXES_STATE_FEATURE_SELECTOR = createFeatureSelector<IState['gamepadAxesState']>('gamepadAxesState');

const GAMEPAD_AXES_STATE_ENTITY_SELECTORS = GAMEPAD_AXES_STATES_ENTITY_ADAPTER.getSelectors();

export const GAMEPAD_AXES_STATE_SELECTORS = {
    selectAll: createSelector(GAMEPAD_AXES_STATE_FEATURE_SELECTOR, GAMEPAD_AXES_STATE_ENTITY_SELECTORS.selectAll),
    selectEntities: createSelector(GAMEPAD_AXES_STATE_FEATURE_SELECTOR, GAMEPAD_AXES_STATE_ENTITY_SELECTORS.selectEntities),
    selectValueByIndex: (gamepadIndex: number, axisIndex: number) => createSelector(
        GAMEPAD_AXES_STATE_SELECTORS.selectEntities,
        (state) => state[gamepadAxisIdFn(gamepadIndex, axisIndex)]?.value
    ),
} as const;
