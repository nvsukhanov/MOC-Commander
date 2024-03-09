import { Selector, createSelector } from '@ngrx/store';

import { HUB_RUNTIME_DATA_ENTITY_ADAPTER, HUB_RUNTIME_DATA_FEATURE } from '../reducers';

const SELECT_ALL = createSelector(
    HUB_RUNTIME_DATA_FEATURE.selectHubRuntimeDataState,
    HUB_RUNTIME_DATA_ENTITY_ADAPTER.getSelectors().selectAll
);

const SELECT_IDS = createSelector(
    HUB_RUNTIME_DATA_FEATURE.selectHubRuntimeDataState,
    HUB_RUNTIME_DATA_ENTITY_ADAPTER.getSelectors().selectIds
) as Selector<unknown, string[]>;

const SELECT_ENTITIES = createSelector(
    HUB_RUNTIME_DATA_FEATURE.selectHubRuntimeDataState,
    HUB_RUNTIME_DATA_ENTITY_ADAPTER.getSelectors().selectEntities
);

export const HUB_RUNTIME_DATA_SELECTORS = {
    selectAll: SELECT_ALL,
    selectEntities: SELECT_ENTITIES,
    selectIds: SELECT_IDS,
    selectTotal: createSelector(
        HUB_RUNTIME_DATA_FEATURE.selectHubRuntimeDataState,
        HUB_RUNTIME_DATA_ENTITY_ADAPTER.getSelectors().selectTotal
    ),
    selectByHubId: (hubId: string) => createSelector(
        HUB_RUNTIME_DATA_SELECTORS.selectEntities,
        (state) => state[hubId]
    ),
    selectIsHubConnected: (hubId: string) => createSelector(
        HUB_RUNTIME_DATA_SELECTORS.selectByHubId(hubId),
        (hubRuntimeData): boolean => !!hubRuntimeData
    ),
    selectHubFirmwareVersion: (hubId: string) => createSelector(
        HUB_RUNTIME_DATA_SELECTORS.selectByHubId(hubId),
        (hubRuntimeData) => hubRuntimeData?.firmwareVersion
    ),
    selectHubHardwareVersion: (hubId: string) => createSelector(
        HUB_RUNTIME_DATA_SELECTORS.selectByHubId(hubId),
        (hubRuntimeData) => hubRuntimeData?.hardwareVersion
    ),
    canRequestPortValue: ({ hubId, portId }: { hubId: string; portId: number }) => createSelector(
        HUB_RUNTIME_DATA_SELECTORS.selectByHubId(hubId),
        (hubRuntimeData) => !hubRuntimeData?.valueRequestPortIds.includes(portId)
    ),
    isPortValueRequested: ({ hubId, portId }: { hubId: string; portId: number }) => createSelector(
        HUB_RUNTIME_DATA_SELECTORS.selectByHubId(hubId),
        (hubRuntimeData) => !!hubRuntimeData?.valueRequestPortIds.includes(portId)
    )
} as const;
