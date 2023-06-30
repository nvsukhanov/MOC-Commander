import { createFeatureSelector, createSelector } from '@ngrx/store';

import { CONTROLLERS_ENTITY_ADAPTER, ControllersState } from './controllers.reducer';
import { ControllerType, GamepadControllerModel, KeyboardControllerModel } from './controller-model';

const CONTROLLERS_FEATURE_SELECTOR = createFeatureSelector<ControllersState>('controllers');

const CONTROLLERS_ENTITY_SELECTOR = CONTROLLERS_ENTITY_ADAPTER.getSelectors();

const CONTROLLERS_SELECT_ALL = createSelector(
    CONTROLLERS_FEATURE_SELECTOR,
    CONTROLLERS_ENTITY_SELECTOR.selectAll
);

const CONTROLLERS_SELECT_ENTITIES = createSelector(
    CONTROLLERS_FEATURE_SELECTOR,
    CONTROLLERS_ENTITY_SELECTOR.selectEntities
);

export const CONTROLLER_SELECTORS = {
    selectAll: CONTROLLERS_SELECT_ALL,
    selectEntities: CONTROLLERS_SELECT_ENTITIES,
    selectGamepads: createSelector(
        CONTROLLERS_SELECT_ALL,
        (controllers) => controllers.filter((c) => c.controllerType === ControllerType.Gamepad) as GamepadControllerModel[]
    ),
    selectKeyboards: createSelector(
        CONTROLLERS_SELECT_ALL,
        (controllers) => controllers.filter((c) => c.controllerType === ControllerType.Keyboard) as KeyboardControllerModel[]
    ),
    selectById: (id: string) => createSelector(
        CONTROLLERS_SELECT_ENTITIES,
        (entities) => entities[id]
    ),
    count: createSelector(
        CONTROLLERS_SELECT_ALL,
        (controllers) => controllers.length
    )
} as const;
