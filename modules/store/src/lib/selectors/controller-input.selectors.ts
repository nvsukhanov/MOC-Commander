import { createSelector } from '@ngrx/store';
import { CONTROLLER_NULL_INPUT_VALUE } from '@app/controller-profiles';

import { CONTROLLER_INPUT_ENTITY_ADAPTER, CONTROLLER_INPUT_FEATURE } from '../reducers';
import { CONTROLLER_CONNECTION_SELECTORS } from './controller-connection.selectors';
import { CONTROLLER_SETTINGS_SELECTORS } from './controller-settings.selectors';
import { isControllerInputActivated, transformControllerInputValue } from '../helpers';

const CONTROLLER_INPUT_ENTITY_ADAPTER_SELECTORS = CONTROLLER_INPUT_ENTITY_ADAPTER.getSelectors();

const SELECT_ALL = createSelector(
    CONTROLLER_INPUT_FEATURE.selectControllerInputState,
    CONTROLLER_INPUT_ENTITY_ADAPTER_SELECTORS.selectAll
);

export const CONTROLLER_INPUT_SELECTORS = {
    selectAll: SELECT_ALL,
    selectEntities: createSelector(
        CONTROLLER_INPUT_FEATURE.selectControllerInputState,
        CONTROLLER_INPUT_ENTITY_ADAPTER_SELECTORS.selectEntities
    ),
    selectRawValueById: (id: string) => createSelector(
        CONTROLLER_INPUT_SELECTORS.selectEntities,
        (entities) => entities[id]?.rawValue ?? 0
    ),
    selectValueById: (id: string) => createSelector(
        CONTROLLER_INPUT_SELECTORS.selectEntities,
        CONTROLLER_SETTINGS_SELECTORS.selectEntities,
        (inputEntities, settingsEntities) => {
            const entity = inputEntities[id];
            if (!entity) {
                return 0;
            }
            const settings = settingsEntities[entity.controllerId];
            if (!settings) {
                return CONTROLLER_NULL_INPUT_VALUE;
            }
            return transformControllerInputValue(entity, settings);
        }
    ),
    selectIsActivatedById: (id: string) => createSelector(
        CONTROLLER_INPUT_SELECTORS.selectEntities,
        CONTROLLER_SETTINGS_SELECTORS.selectEntities,
        (inputEntities, controllerSettingsEntities) => {
            const entity = inputEntities[id];
            if (!entity) {
                return false;
            }
            const controllerSettings = controllerSettingsEntities[entity.controllerId];
            return !!controllerSettings && isControllerInputActivated(entity, controllerSettings);
        }
    ),
    selectFirstActivated: createSelector(
        SELECT_ALL,
        CONTROLLER_SETTINGS_SELECTORS.selectEntities,
        (inputsList, controllerSettingsEntities) => {
            return inputsList.find((input) => {
                const controllerSettings = controllerSettingsEntities[input.controllerId];
                return controllerSettings && isControllerInputActivated(input, controllerSettings);
            });
        }
    ),
    listenersCount: CONTROLLER_INPUT_FEATURE.selectListenersCount,
    isCapturing: createSelector(
        CONTROLLER_INPUT_FEATURE.selectListenersCount,
        (listenersCount) => listenersCount > 0
    ),
    isKeyboardBeingCaptured: createSelector(
        CONTROLLER_INPUT_FEATURE.selectListenersCount,
        CONTROLLER_CONNECTION_SELECTORS.selectKeyboardConnection,
        (listenersCount, keyboardConnection) => listenersCount > 0 && !!keyboardConnection
    )
} as const;
