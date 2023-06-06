import { createFeatureSelector, createSelector } from '@ngrx/store';

import { IState } from '../i-state';
import { CONTROLLER_INPUT_ENTITY_ADAPTER } from '../entity-adapters';

const CONTROLLER_INPUT_FEATURE_SELECTOR = createFeatureSelector<IState['controllerInput']>('controllerInput');

const CONTROLLER_INPUT_ENTITY_ADAPTER_SELECTORS = CONTROLLER_INPUT_ENTITY_ADAPTER.getSelectors();

const SELECT_ALL = createSelector(
    CONTROLLER_INPUT_FEATURE_SELECTOR,
    CONTROLLER_INPUT_ENTITY_ADAPTER_SELECTORS.selectAll
);

export const CONTROLLER_INPUT_SELECTORS = {
    selectAll: SELECT_ALL,
    selectEntities: createSelector(
        CONTROLLER_INPUT_FEATURE_SELECTOR,
        CONTROLLER_INPUT_ENTITY_ADAPTER_SELECTORS.selectEntities
    ),
    selectValueById: (id: string) => createSelector(
        CONTROLLER_INPUT_SELECTORS.selectEntities,
        (entities) => entities[id]?.value ?? 0
    ),
    selectFirst: createSelector(
        SELECT_ALL,
        (entities) => entities[0]
    ),
} as const;
