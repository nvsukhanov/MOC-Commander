import { createFeatureSelector, createSelector } from '@ngrx/store';

import { IState } from '../i-state';
import { HUB_STATS_ENTITY_ADAPTER } from './hub-stats.reducer';

const HUB_STATS_FEATURE_SELECTOR = createFeatureSelector<IState['hubStats']>('hubStats');

const HUB_STATS_ENTITY_ADAPTER_SELECTORS = HUB_STATS_ENTITY_ADAPTER.getSelectors();

const SELECT_ALL = createSelector(
    HUB_STATS_FEATURE_SELECTOR,
    HUB_STATS_ENTITY_ADAPTER_SELECTORS.selectAll
);

const SELECT_IDS = createSelector(
    HUB_STATS_FEATURE_SELECTOR,
    HUB_STATS_ENTITY_ADAPTER_SELECTORS.selectIds
);

export const HUB_STATS_SELECTORS = {
    selectAll: SELECT_ALL,
    selectEntities: createSelector(
        HUB_STATS_FEATURE_SELECTOR,
        HUB_STATS_ENTITY_ADAPTER_SELECTORS.selectEntities
    ),
    selectIds: SELECT_IDS,
    selectByHubId: (hubId: string) => createSelector(
        HUB_STATS_SELECTORS.selectEntities,
        (state) => state[hubId]
    ),
    selectIsHubConnected: (hubId: string) => createSelector(
        HUB_STATS_SELECTORS.selectByHubId(hubId),
        (hubStats): boolean => !!hubStats
    )
} as const;
