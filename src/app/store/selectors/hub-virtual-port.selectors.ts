import { createFeatureSelector, createSelector } from '@ngrx/store';

import { IState } from '../i-state';
import { HUB_VIRTUAL_PORT_ENTITY_ADAPTER, hubVirtualPortIdFn } from '../entity-adapters';

const HUB_VIRTUAL_PORT_FEATURE_SELECTOR = createFeatureSelector<IState['hubVirtualPorts']>('hubVirtualPorts');

const HUB_VIRTUAL_PORT_ENTITY_SELECTORS = HUB_VIRTUAL_PORT_ENTITY_ADAPTER.getSelectors();

const SELECT_ALL = createSelector(
    HUB_VIRTUAL_PORT_FEATURE_SELECTOR,
    HUB_VIRTUAL_PORT_ENTITY_SELECTORS.selectAll
);

const SELECT_ENTITIES = createSelector(
    HUB_VIRTUAL_PORT_FEATURE_SELECTOR,
    HUB_VIRTUAL_PORT_ENTITY_SELECTORS.selectEntities
);

export const HUB_VIRTUAL_PORT_SELECTORS = {
    selectAll: SELECT_ALL,
    selectEntities: SELECT_ENTITIES,
    selectByPort: (q: { hubId: string, portId: number }) => createSelector(
        SELECT_ENTITIES,
        (entities) => entities[hubVirtualPortIdFn(q)]
    )
} as const;
