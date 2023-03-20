import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ControllerType, IState } from '../i-state';

export const SELECT_CONTROLLER_FEATURE = createFeatureSelector<IState['controller']>('controller');

export const SELECT_CONTROLLER_TYPE = createSelector(
    SELECT_CONTROLLER_FEATURE,
    (state) => state.controllerType
);

export const SELECT_CONTROLLER_CONNECTION_STATE = createSelector(
    SELECT_CONTROLLER_FEATURE,
    (state) => state.connectionState
);

export const SELECT_CONTROLLER_CONFIG = createSelector(
    SELECT_CONTROLLER_FEATURE,
    (state) => {
        switch (state.controllerType) {
            case ControllerType.GamePad:
                return state.gamepadConfig;
            case ControllerType.Unassigned:
            case null:
                return null;
        }
    }
);

export const SELECT_CONTROLLER_STATE = createSelector(
    SELECT_CONTROLLER_FEATURE,
    (state) => state.controllerState
);

export const SELECTED_GAMEPAD_INDEX = createSelector(
    SELECT_CONTROLLER_FEATURE,
    (state) => state.gamepadConfig.index
);
