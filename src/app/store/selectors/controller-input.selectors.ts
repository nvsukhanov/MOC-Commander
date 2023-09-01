import { createSelector } from '@ngrx/store';

import { CONTROLLER_INPUT_ENTITY_ADAPTER, CONTROLLER_INPUT_FEATURE } from '../reducers';
import { CONTROLLER_CONNECTION_SELECTORS } from './controller-connection.selectors';

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
        (entities) => entities[id]?.value ?? 0
    ),
    selectFirst: createSelector(
        SELECT_ALL,
        (inputsList) => inputsList[0]
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
