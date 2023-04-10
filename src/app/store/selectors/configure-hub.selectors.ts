/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { IState } from '../i-state';
import { HUBS_ENTITY_ADAPTER } from '../entity-adapters';

export const SELECT_HUB_FEATURE = createFeatureSelector<IState['hubs']>('hubs');

export const SELECT_CONNECTED_HUBS = createSelector(
    SELECT_HUB_FEATURE,
    HUBS_ENTITY_ADAPTER.getSelectors().selectAll
);
