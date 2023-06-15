/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { createFeatureSelector, createSelector } from '@ngrx/store';

import { IState } from '../i-state';
import { HUB_VIRTUAL_PORT_CONFIGS_ENTITY_ADAPTER } from '../entity-adapters';

const HUB_VIRTUAL_PORT_CONFIGS_FEATURE_SELECTOR = createFeatureSelector<IState['hubVirtualPortConfigs']>('hubVirtualPortConfigs');

const HUB_VIRTUAL_PORT_CONFIGS_ENTITY_SELECTORS = HUB_VIRTUAL_PORT_CONFIGS_ENTITY_ADAPTER.getSelectors();

const SELECT_ENTITIES = createSelector(
    HUB_VIRTUAL_PORT_CONFIGS_FEATURE_SELECTOR,
    HUB_VIRTUAL_PORT_CONFIGS_ENTITY_SELECTORS.selectEntities
);

const SELECT_ALL = createSelector(
    HUB_VIRTUAL_PORT_CONFIGS_FEATURE_SELECTOR,
    HUB_VIRTUAL_PORT_CONFIGS_ENTITY_SELECTORS.selectAll
);

export const HUB_VIRTUAL_PORT_CONFIGS_SELECTORS = {
    selectEntities: SELECT_ENTITIES,
    selectAll: SELECT_ALL
};
