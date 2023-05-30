/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { HubConnectionState, IState } from '../i-state';
import { HUB_CONNECTIONS_ENTITY_ADAPTER } from '../entity-adapters';

const HUB_CONNECTIONS_FEATURE_SELECTOR = createFeatureSelector<IState['hubConnections']>('hubConnections');

const HUB_CONNECTION_ENTITY_SELECTORS = HUB_CONNECTIONS_ENTITY_ADAPTER.getSelectors();

export const HUB_CONNECTION_SELECTORS = {
    selectEntities: createSelector(
        HUB_CONNECTIONS_FEATURE_SELECTOR,
        HUB_CONNECTION_ENTITY_SELECTORS.selectEntities
    ),
    selectHubConnectionState: (hubId: string) => createSelector(
        HUB_CONNECTION_SELECTORS.selectEntities,
        (hubConnections): HubConnectionState => hubConnections[hubId]?.connectionState ?? HubConnectionState.Disconnected
    ),
    selectIsHubConnected: (hubId: string) => createSelector(
        HUB_CONNECTION_SELECTORS.selectHubConnectionState(hubId),
        (connectionState): boolean => connectionState === HubConnectionState.Connected
    ),
};
