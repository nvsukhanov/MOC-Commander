/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { HUB_ATTACHED_IOS_ENTITY_ADAPTER, hubAttachedIosIdFn } from '../entity-adapters';
import { IState } from '../i-state';

const SELECT_HUB_ATTACHED_IOS_FEATURE = createFeatureSelector<IState['hubAttachedIOs']>('hubAttachedIOs');

const SELECT_HUB_ATTACHED_IOS_ENTITIES = createSelector(
    SELECT_HUB_ATTACHED_IOS_FEATURE,
    HUB_ATTACHED_IOS_ENTITY_ADAPTER.getSelectors().selectEntities
);

export const SELECT_HUB_IO_AT_PORT = (hubId: string, portId: number) => createSelector(
    SELECT_HUB_ATTACHED_IOS_ENTITIES,
    (state) => state[hubAttachedIosIdFn(hubId, portId)]
);

export const SELECT_IOS_ALL = createSelector(
    SELECT_HUB_ATTACHED_IOS_FEATURE,
    HUB_ATTACHED_IOS_ENTITY_ADAPTER.getSelectors().selectAll
);

