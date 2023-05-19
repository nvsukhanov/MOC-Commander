import { createFeatureSelector, createSelector } from '@ngrx/store';
import { IState } from '../i-state';
import { GAMEPAD_BUTTONS_STATES_ENTITY_ADAPTER, gamepadButtonIdFn } from '../entity-adapters';

const GAMEPAD_BUTTONS_STATE_FEATURE_SELECTOR = createFeatureSelector<IState['gamepadButtonsState']>('gamepadButtonsState');

const GAMEPAD_BUTTONS_STATE_ENTITY_SELECTORS = GAMEPAD_BUTTONS_STATES_ENTITY_ADAPTER.getSelectors();

const GAMEPAD_BUTTONS_SELECT_ALL = createSelector(GAMEPAD_BUTTONS_STATE_FEATURE_SELECTOR, GAMEPAD_BUTTONS_STATE_ENTITY_SELECTORS.selectAll);

const GAMEPAD_BUTTON_BINDING_THRESHOLD = 0.9;

export const GAMEPAD_BUTTONS_STATE_SELECTORS = {
    selectAll: GAMEPAD_BUTTONS_SELECT_ALL,
    selectEntities: createSelector(GAMEPAD_BUTTONS_STATE_FEATURE_SELECTOR, GAMEPAD_BUTTONS_STATE_ENTITY_SELECTORS.selectEntities),
    selectByIndex: (gamepadIndex: number, buttonIndex: number) => createSelector(
        GAMEPAD_BUTTONS_STATE_SELECTORS.selectEntities,
        (state) => state[gamepadButtonIdFn(gamepadIndex, buttonIndex)]
    ),
    selectValueByIndex: (gamepadIndex: number, buttonIndex: number) => createSelector(
        GAMEPAD_BUTTONS_STATE_SELECTORS.selectEntities,
        (state) => state[gamepadButtonIdFn(gamepadIndex, buttonIndex)]?.value
    ),
    selectFistBinding: createSelector(
        GAMEPAD_BUTTONS_SELECT_ALL,
        (states) => {
            return states.find((state) => state.value >= GAMEPAD_BUTTON_BINDING_THRESHOLD);
        }
    )
} as const;
