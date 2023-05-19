/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { IState } from '../i-state';
import { HUBS_ENTITY_ADAPTER } from '../entity-adapters';

const SELECT_HUBS_FEATURE = createFeatureSelector<IState['hubs']>('hubs');

const SELECT_HUBS_ENTITIES = createSelector(
    SELECT_HUBS_FEATURE,
    HUBS_ENTITY_ADAPTER.getSelectors().selectEntities
);

const SELECT_HUBS_LIST = HUBS_ENTITY_ADAPTER.getSelectors().selectAll;

export const HUBS_SELECTORS = {
    selectHubs: createSelector(SELECT_HUBS_FEATURE, SELECT_HUBS_LIST),
    selectHubsIds: createSelector(SELECT_HUBS_FEATURE, HUBS_ENTITY_ADAPTER.getSelectors().selectIds),
    selectHubsCount: createSelector(SELECT_HUBS_FEATURE, HUBS_ENTITY_ADAPTER.getSelectors().selectTotal),
    selectHub: (hubId: string) => createSelector(SELECT_HUBS_ENTITIES, (state) => state[hubId])
} as const;
