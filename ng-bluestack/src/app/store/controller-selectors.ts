import { createFeatureSelector, createSelector } from '@ngrx/store';
import { IState } from './i-state';
import { ControllerType } from '../types';

export const SELECT_CONTROLLER_FEATURE = createFeatureSelector<IState['controller']>('controller');

export const SELECT_CONTROLLER_TYPE = createSelector(
    SELECT_CONTROLLER_FEATURE,
    (state) => state.controllerType
);

export const SELECT_IS_CONTROLLER_CONNECTED = createSelector(
    SELECT_CONTROLLER_FEATURE,
    (state) => {
        switch (state.controllerType) {
            case ControllerType.Unassigned:
                return false;
            case null:
                return false;
            case ControllerType.GamePad:
                return state.gamepadController.isConnected;
        }
    }
);

export const SELECT_CONTROLLER_CONFIG = createSelector(
    SELECT_CONTROLLER_FEATURE,
    (state) => {
        switch (state.controllerType) {
            case ControllerType.GamePad:
                return state.gamepadController;
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
