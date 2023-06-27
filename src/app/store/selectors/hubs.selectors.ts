/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { createFeatureSelector, createSelector } from '@ngrx/store';

import { IState } from '../i-state';
import { HUBS_ENTITY_ADAPTER } from '../entity-adapters';
import { HUB_STATS_SELECTORS } from './hub-stats.selectors';

const SELECT_HUBS_FEATURE = createFeatureSelector<IState['hubs']>('hubs');

const SELECT_HUBS_ENTITIES = createSelector(
    SELECT_HUBS_FEATURE,
    HUBS_ENTITY_ADAPTER.getSelectors().selectEntities
);

const HUBS_ENTITY_SELECTORS = HUBS_ENTITY_ADAPTER.getSelectors();

const HUBS_SELECT_ALL = createSelector(
    SELECT_HUBS_FEATURE,
    HUBS_ENTITY_SELECTORS.selectAll
);

export const HUBS_SELECTORS = {
    selectHubs: HUBS_SELECT_ALL,
    selectHubEntities: SELECT_HUBS_ENTITIES,
    selectHubsIds: createSelector(SELECT_HUBS_FEATURE, HUBS_ENTITY_ADAPTER.getSelectors().selectIds),
    selectHubsCount: createSelector(SELECT_HUBS_FEATURE, HUBS_ENTITY_ADAPTER.getSelectors().selectTotal),
    selectHubName: (hubId: string) => createSelector(
        SELECT_HUBS_ENTITIES,
        (hubEntities) => hubEntities[hubId]?.name
    ),
    selectConnectedHubsCount: createSelector(
        HUB_STATS_SELECTORS.selectIds,
        (statIds) => statIds.length
    ),
    selectHub: (hubId: string) => createSelector(SELECT_HUBS_ENTITIES, (state) => state[hubId]),
    selectHubsWithConnectionState: createSelector(
        HUBS_SELECT_ALL,
        HUB_STATS_SELECTORS.selectEntities,
        (hubs, hubStats) => {
            return hubs.map((hub) => ({
                ...hub,
                isConnected: !!hubStats[hub.hubId]
            }));
        }
    ),
    selectHubListViewModel: createSelector(
        HUBS_SELECT_ALL,
        HUB_STATS_SELECTORS.selectEntities,
        (hubs, hubStats) => {
            return hubs.map((hub) => ({
                ...hub,
                batteryLevel: hubStats[hub.hubId]?.batteryLevel || null,
                RSSI: hubStats[hub.hubId]?.RSSI || null,
                isButtonPressed: hubStats[hub.hubId]?.isButtonPressed || false,
                hasCommunication: hubStats[hub.hubId]?.hasCommunication || false,
                isConnected: !!hubStats[hub.hubId]
            }));
        }
    ),
} as const;
