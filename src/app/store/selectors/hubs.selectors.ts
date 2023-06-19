/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { createFeatureSelector, createSelector } from '@ngrx/store';

import { HubConnectionState, IState } from '../i-state';
import { HUBS_ENTITY_ADAPTER } from '../entity-adapters';
import { HUB_CONNECTION_SELECTORS } from './hub-connections.selectors';

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
        HUBS_SELECT_ALL,
        HUB_CONNECTION_SELECTORS.selectEntities,
        (hubs, hubConnections) => {
            return hubs.filter((hub) => hubConnections[hub.hubId]?.connectionState === HubConnectionState.Connected).length;
        }
    ),
    selectHub: (hubId: string) => createSelector(SELECT_HUBS_ENTITIES, (state) => state[hubId]),
    selectHubsWithConnectionState: createSelector(
        HUBS_SELECT_ALL,
        HUB_CONNECTION_SELECTORS.selectEntities,
        (hubs, hubConnections) => {
            return hubs.map((hub) => ({
                ...hub,
                connectionState: hubConnections[hub.hubId]?.connectionState ?? HubConnectionState.Disconnected
            }));
        }
    )
} as const;
