import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ControllerConnectionState, ControllerType, IState } from '../i-state';
import { MAPPING_CONTROLLER_TO_L10N } from '../../mappings';

const SELECT_CONTROLLER_FEATURE = createFeatureSelector<IState['controller']>('controller');

export const CONTROLLER_SELECTORS = {
    selectControllerConnectionState: createSelector(SELECT_CONTROLLER_FEATURE, (state) => state.connectionState),
    selectControllerState: createSelector(SELECT_CONTROLLER_FEATURE, (state) => state.controllerState),
    selectGamepadIndex: createSelector(SELECT_CONTROLLER_FEATURE, (state) => state.gamepadConfig.index),
    selectConnectedControllers: createSelector(
        SELECT_CONTROLLER_FEATURE,
        (state) => {
            const result: Array<{ nameL10nKey: string, type: ControllerType, id: number }> = [];
            if (state.connectionState === ControllerConnectionState.Connected) {
                switch (state.controllerType) {
                    case ControllerType.GamePad:
                        if (state.gamepadConfig.index !== null) {
                            result.push({
                                nameL10nKey: state.gamepadConfig.nameL10nKey as string,
                                type: state.controllerType,
                                id: state.gamepadConfig.index
                            });
                        }
                        break;
                    case ControllerType.Keyboard:
                        result.push({
                            nameL10nKey: MAPPING_CONTROLLER_TO_L10N[ControllerType.Keyboard],
                            type: state.controllerType,
                            id: 0
                        });
                        break;
                }
            }
            return result;
        }
    )
} as const;
