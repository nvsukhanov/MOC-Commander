import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { CONTROLLERS_ACTIONS, ControllerConnectionModel, controllerIdFn } from '@app/store';
import { createFeature, createReducer, on } from '@ngrx/store';
import { ControllerType } from '@app/shared';

export type ControllerConnectionState = EntityState<ControllerConnectionModel>;

export const CONTROLLER_CONNECTION_ADAPTER = createEntityAdapter<ControllerConnectionModel>({
    selectId: (connection) => connection.controllerId,
});

export const CONTROLLER_CONNECTION_FEATURE = createFeature({
    name: 'controllerConnections',
    reducer: createReducer(
        CONTROLLER_CONNECTION_ADAPTER.getInitialState(),
        on(CONTROLLERS_ACTIONS.keyboardConnected, CONTROLLERS_ACTIONS.keyboardDiscovered, (state, { profileUid }): ControllerConnectionState => {
            return CONTROLLER_CONNECTION_ADAPTER.addOne({
                controllerId: controllerIdFn({ profileUid, controllerType: ControllerType.Keyboard }),
                controllerType: ControllerType.Keyboard
            }, state);
        }),
        on(CONTROLLERS_ACTIONS.gamepadDiscovered, (state, action): ControllerConnectionState => {
            return CONTROLLER_CONNECTION_ADAPTER.addOne({
                controllerId: action.id,
                gamepadIndex: action.gamepadApiIndex,
                controllerType: ControllerType.Gamepad
            }, state);
        }),
        on(CONTROLLERS_ACTIONS.gamepadConnected, (state, action): ControllerConnectionState => {
            return CONTROLLER_CONNECTION_ADAPTER.addOne({
                controllerId: action.id,
                gamepadIndex: action.gamepadApiIndex,
                controllerType: ControllerType.Gamepad
            }, state);
        }),
        on(CONTROLLERS_ACTIONS.gamepadDisconnected, (state, action): ControllerConnectionState => {
            return CONTROLLER_CONNECTION_ADAPTER.removeOne(action.id, state);
        }),
    )
});
