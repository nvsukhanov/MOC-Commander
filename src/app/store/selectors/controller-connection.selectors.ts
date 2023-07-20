import { createSelector } from '@ngrx/store';
import { ControllerType } from '@app/shared';

import { CONTROLLER_CONNECTION_ADAPTER, CONTROLLER_CONNECTION_FEATURE } from '../reducers';
import { CONTROLLER_SELECTORS } from './controllers.selectors';
import { GamepadConnectionModel, GamepadControllerModel } from '../models';

const SELECT_ENTITIES = createSelector(
    CONTROLLER_CONNECTION_FEATURE.selectControllerConnectionsState,
    CONTROLLER_CONNECTION_ADAPTER.getSelectors().selectEntities
);

const SELECT_ALL = createSelector(
    CONTROLLER_CONNECTION_FEATURE.selectControllerConnectionsState,
    CONTROLLER_CONNECTION_ADAPTER.getSelectors().selectAll
);

export const CONTROLLER_CONNECTION_SELECTORS = {
    selectEntities: SELECT_ENTITIES,
    selectAll: SELECT_ALL,
    selectTotal: createSelector(
        CONTROLLER_CONNECTION_FEATURE.selectControllerConnectionsState,
        CONTROLLER_CONNECTION_ADAPTER.getSelectors().selectTotal
    ),
    isConnected: (id: string) => createSelector(
        SELECT_ENTITIES,
        (connections) => !!connections[id]
    ),
    selectByGamepadIndex: (gamepadIndex: number) => createSelector(
        SELECT_ALL,
        (connections) => {
            return connections.find((c) => c.controllerType === ControllerType.Gamepad && c.gamepadIndex === gamepadIndex);
        }
    ),
    selectGamepadConnections: createSelector(
        SELECT_ALL,
        CONTROLLER_SELECTORS.selectEntities,
        (allConnections, controllerEntities) => {
            return allConnections.filter((connection) => controllerEntities[connection.controllerId]?.controllerType === ControllerType.Gamepad)
                                 .map((connection) => ({
                                     connection: connection as GamepadConnectionModel,
                                     // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                                     gamepad: controllerEntities[connection.controllerId]! as GamepadControllerModel
                                 }));
        }
    ),
    selectKeyboardConnection: createSelector(
        SELECT_ALL,
        (allConnections) => allConnections.find((connection) => connection.controllerType === ControllerType.Keyboard)
    )
} as const;
