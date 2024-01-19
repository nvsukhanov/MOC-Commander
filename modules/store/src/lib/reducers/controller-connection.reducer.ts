import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createFeature, createReducer, on } from '@ngrx/store';
import { ControllerType } from '@app/controller-profiles';

import { CONTROLLERS_ACTIONS, HUBS_ACTIONS } from '../actions';
import { ControllerConnectionModel } from '../models';
import { controllerIdFn } from './controllers.reducer';

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
        on(CONTROLLERS_ACTIONS.hubDiscovered, (state, action): ControllerConnectionState => {
            return CONTROLLER_CONNECTION_ADAPTER.addOne({
                controllerId: controllerIdFn({ hubId: action.hubId, controllerType: ControllerType.Hub }),
                controllerType: ControllerType.Hub
            }, state);
        }),
        on(CONTROLLERS_ACTIONS.hubConnected, (state, action): ControllerConnectionState => {
            return CONTROLLER_CONNECTION_ADAPTER.addOne({
                controllerId: controllerIdFn({ hubId: action.hubId, controllerType: ControllerType.Hub }),
                controllerType: ControllerType.Hub
            }, state);
        }),
        on(CONTROLLERS_ACTIONS.hubDisconnected, (state, action): ControllerConnectionState => {
            return CONTROLLER_CONNECTION_ADAPTER.removeOne(
                controllerIdFn({ hubId: action.hubId, controllerType: ControllerType.Hub }),
                state
            );
        }),
        on(HUBS_ACTIONS.forgetHub, (state, action): ControllerConnectionState => {
            return CONTROLLER_CONNECTION_ADAPTER.removeOne(
                controllerIdFn({ hubId: action.hubId, controllerType: ControllerType.Hub }),
                state
            );
        }),
        on(CONTROLLERS_ACTIONS.forgetController, (state, action): ControllerConnectionState => {
            return CONTROLLER_CONNECTION_ADAPTER.removeOne(action.controllerId, state);
        })
    )
});
