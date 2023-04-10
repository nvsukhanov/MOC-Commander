import { createFeatureSelector, createSelector } from '@ngrx/store';
import { IState } from '../i-state';
import { HUB_IO_DATA_ENTITY_ADAPTER, hubIODataIdFn } from '../entity-adapters';

const SELECT_HUB_IO_DATA_FEATURE = createFeatureSelector<IState['hubIOdata']>('hubIOData');

const SELECT_HUB_IO_DATA_ENTITIES = createSelector(
    SELECT_HUB_IO_DATA_FEATURE,
    HUB_IO_DATA_ENTITY_ADAPTER.getSelectors().selectEntities
);

export const SELECT_PORT_IO_DATA = (hubId: string, portId: number) => createSelector(
    SELECT_HUB_IO_DATA_ENTITIES,
    (state) => state[hubIODataIdFn(hubId, portId)]
);
