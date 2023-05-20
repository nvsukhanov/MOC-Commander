import { createFeatureSelector, createSelector } from '@ngrx/store';
import { IState } from '../i-state';
import { GAMEPADS_ENTITY_ADAPTER } from '../entity-adapters';

const GAMEPAD_FEATURE_SELECTOR = createFeatureSelector<IState['gamepads']>('gamepads');

const GAMEPAD_ENTITY_SELECTORS = GAMEPADS_ENTITY_ADAPTER.getSelectors();

export const GAMEPAD_SELECTORS = {
    selectAll: createSelector(GAMEPAD_FEATURE_SELECTOR, GAMEPAD_ENTITY_SELECTORS.selectAll),
    selectEntities: createSelector(GAMEPAD_FEATURE_SELECTOR, GAMEPAD_ENTITY_SELECTORS.selectEntities),
    selectGamepadsCount: createSelector(GAMEPAD_FEATURE_SELECTOR, GAMEPAD_ENTITY_SELECTORS.selectTotal),
    selectIds: createSelector(GAMEPAD_FEATURE_SELECTOR, GAMEPAD_ENTITY_SELECTORS.selectIds),
    selectById: (id: number) => createSelector(GAMEPAD_SELECTORS.selectEntities, (entities) => entities[id]),
    selectAxisConfigByIndex: (gamepadIndex: number, axisIndex: number) => createSelector(
        GAMEPAD_SELECTORS.selectById(gamepadIndex),
        (gamepad) => gamepad?.axes.find((axis) => axis.index === axisIndex)
    ),
    selectButtonConfigByIndex: (gamepadIndex: number, buttonIndex: number) => createSelector(
        GAMEPAD_SELECTORS.selectById(gamepadIndex),
        (gamepad) => gamepad?.buttons.find((button) => button.index === buttonIndex)
    ),
} as const;
