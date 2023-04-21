/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { IState } from '../i-state';
import { HUB_IO_DATA_ENTITY_ADAPTER, hubIODataIdFn } from '../entity-adapters';

const SELECT_HUB_IO_DATA_FEATURE = createFeatureSelector<IState['hubIOState']>('hubIOData');

const HUB_IO_DATA_ADAPTER_SELECTORS = HUB_IO_DATA_ENTITY_ADAPTER.getSelectors();

const SELECT_HUB_IO_DATA_ENTITIES = createSelector(
    SELECT_HUB_IO_DATA_FEATURE,
    HUB_IO_DATA_ADAPTER_SELECTORS.selectEntities
);

export const HUB_IO_DATA_SELECTORS = {
    selectPortIOData: (hubId: string, portId: number) => createSelector(SELECT_HUB_IO_DATA_ENTITIES, (state) => state[hubIODataIdFn(hubId, portId)]),
} as const;
