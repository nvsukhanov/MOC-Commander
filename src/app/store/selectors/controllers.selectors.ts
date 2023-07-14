import { createSelector } from '@ngrx/store';

import { CONTROLLERS_ENTITY_ADAPTER, CONTROLLERS_FEATURE } from '../reducers';
import { GamepadControllerModel } from '../models';
import { ControllerType } from '@app/shared';

const CONTROLLERS_ENTITY_SELECTOR = CONTROLLERS_ENTITY_ADAPTER.getSelectors();

const CONTROLLERS_SELECT_ALL = createSelector(
    CONTROLLERS_FEATURE.selectControllersState,
    CONTROLLERS_ENTITY_SELECTOR.selectAll
);

const CONTROLLERS_SELECT_ENTITIES = createSelector(
    CONTROLLERS_FEATURE.selectControllersState,
    CONTROLLERS_ENTITY_SELECTOR.selectEntities
);

const CONTROLLERS_SELECT_IDS = createSelector(
    CONTROLLERS_FEATURE.selectControllersState,
    CONTROLLERS_ENTITY_SELECTOR.selectIds
);

export const CONTROLLER_SELECTORS = {
    selectAll: CONTROLLERS_SELECT_ALL,
    selectIds: CONTROLLERS_SELECT_IDS,
    selectEntities: CONTROLLERS_SELECT_ENTITIES,
    selectGamepads: createSelector(
        CONTROLLERS_SELECT_ALL,
        (controllers) => controllers.filter((c) => c.controllerType === ControllerType.Gamepad) as GamepadControllerModel[]
    ),
    hasKeyboardConnected: createSelector(
        CONTROLLERS_SELECT_ALL,
        (controllers) => controllers.some((c) => c.controllerType === ControllerType.Keyboard)
    ),
    selectById: (id: string) => createSelector(
        CONTROLLERS_SELECT_ENTITIES,
        (entities) => entities[id]
    )
} as const;