import { createFeatureSelector, createSelector } from '@ngrx/store';

import { IState } from '../i-state';
import { HUB_STATS_ENTITY_ADAPTER } from '../entity-adapters';

const HUB_STATS_FEATURE_SELECTOR = createFeatureSelector<IState['hubStats']>('hubStats');

const HUB_STATS_ENTITY_ADAPTER_SELECTORS = HUB_STATS_ENTITY_ADAPTER.getSelectors();

export const HUB_STATS_SELECTORS = {
    selectAll: createSelector(
        HUB_STATS_FEATURE_SELECTOR,
        HUB_STATS_ENTITY_ADAPTER_SELECTORS.selectAll
    ),
    selectEntities: createSelector(
        HUB_STATS_FEATURE_SELECTOR,
        HUB_STATS_ENTITY_ADAPTER_SELECTORS.selectEntities
    ),
    selectIds: createSelector(
        HUB_STATS_FEATURE_SELECTOR,
        HUB_STATS_ENTITY_ADAPTER_SELECTORS.selectIds
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
