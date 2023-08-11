/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { createSelector } from '@ngrx/store';

import { HUBS_ENTITY_ADAPTER, HUBS_FEATURE } from '../reducers';
import { HubDiscoveryState } from '../models';

const SELECT_HUBS_ENTITIES = createSelector(
    HUBS_FEATURE.selectHubsState,
    HUBS_ENTITY_ADAPTER.getSelectors().selectEntities
);

const HUBS_ENTITY_SELECTORS = HUBS_ENTITY_ADAPTER.getSelectors();

const HUBS_SELECT_ALL = createSelector(
    HUBS_FEATURE.selectHubsState,
    HUBS_ENTITY_SELECTORS.selectAll
);

export const HUBS_SELECTORS = {
    selectAll: HUBS_SELECT_ALL,
    selectEntities: SELECT_HUBS_ENTITIES,
    selectIds: createSelector(HUBS_FEATURE.selectHubsState, HUBS_ENTITY_ADAPTER.getSelectors().selectIds),
    selectTotal: createSelector(HUBS_FEATURE.selectHubsState, HUBS_ENTITY_ADAPTER.getSelectors().selectTotal),
    selectHub: (hubId: string) => createSelector(SELECT_HUBS_ENTITIES, (state) => state[hubId]),
    selectHubName: (hubId: string) => createSelector(SELECT_HUBS_ENTITIES, (state) => state[hubId]?.name ?? ''),
    selectIsDiscovering: createSelector(
        HUBS_FEATURE.selectDiscoveryState,
        (state) => state === HubDiscoveryState.Discovering
    )
} as const;
