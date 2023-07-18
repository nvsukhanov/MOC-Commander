import { createSelector } from '@ngrx/store';

import { HUB_STATS_ENTITY_ADAPTER, HUB_STATS_FEATURE } from '../reducers';

const SELECT_ALL = createSelector(
    HUB_STATS_FEATURE.selectHubStatsState,
    HUB_STATS_ENTITY_ADAPTER.getSelectors().selectAll
);

const SELECT_IDS = createSelector(
    HUB_STATS_FEATURE.selectHubStatsState,
    HUB_STATS_ENTITY_ADAPTER.getSelectors().selectIds
);

const SELECT_ENTITIES = createSelector(
    HUB_STATS_FEATURE.selectHubStatsState,
    HUB_STATS_ENTITY_ADAPTER.getSelectors().selectEntities
);

export const HUB_STATS_SELECTORS = {
    selectAll: SELECT_ALL,
    selectEntities: SELECT_ENTITIES,
    selectIds: SELECT_IDS,
    selectTotal: createSelector(
        HUB_STATS_FEATURE.selectHubStatsState,
        HUB_STATS_ENTITY_ADAPTER.getSelectors().selectTotal
    ),
    selectByHubId: (hubId: string) => createSelector(
        HUB_STATS_SELECTORS.selectEntities,
        (state) => state[hubId]
    ),
    selectIsHubConnected: (hubId: string) => createSelector(
        HUB_STATS_SELECTORS.selectByHubId(hubId),
        (hubStats): boolean => !!hubStats
    )
} as const;
