import { createSelector } from '@ngrx/store';
import { ControllerType } from '@app/shared-misc';

import { CONTROLLER_CONNECTION_ADAPTER, CONTROLLER_CONNECTION_FEATURE } from '../reducers';
import { CONTROLLER_SELECTORS } from './controllers.selectors';
import { GamepadConnectionModel } from '../models';
import { CONTROLLER_SETTINGS_SELECTORS } from './controller-settings.selectors';

const SELECT_ENTITIES = createSelector(
    CONTROLLER_CONNECTION_FEATURE.selectControllerConnectionsState,
    CONTROLLER_CONNECTION_ADAPTER.getSelectors().selectEntities
);

const SELECT_ALL = createSelector(
    CONTROLLER_CONNECTION_FEATURE.selectControllerConnectionsState,
    CONTROLLER_CONNECTION_ADAPTER.getSelectors().selectAll
);

const SELECT_IDS = createSelector(
    CONTROLLER_CONNECTION_FEATURE.selectControllerConnectionsState,
    CONTROLLER_CONNECTION_ADAPTER.getSelectors().selectIds
);

export const CONTROLLER_CONNECTION_SELECTORS = {
    selectEntities: SELECT_ENTITIES,
    selectAll: SELECT_ALL,
    selectIds: SELECT_IDS,
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
        CONTROLLER_SETTINGS_SELECTORS.selectEntities,
        (allConnections, controllerEntities, settings) => {
            return allConnections.filter((connection) => controllerEntities[connection.controllerId]?.controllerType === ControllerType.Gamepad)
                                 .map((connection) => ({
                                     connection: connection as GamepadConnectionModel,
                                     gamepad: controllerEntities[connection.controllerId],
                                     settings: settings[connection.controllerId]
                                 }));
        }
    ),
    selectKeyboardConnection: createSelector(
        SELECT_ALL,
        (allConnections) => allConnections.find((connection) => connection.controllerType === ControllerType.Keyboard)
    )
} as const;
