/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { createSelector } from '@ngrx/store';

import { ATTACHED_IOS_ENTITY_ADAPTER, ATTACHED_IOS_FEATURE, attachedIosIdFn } from '../reducers';

const ATTACHED_IOS_ADAPTER_SELECTORS = ATTACHED_IOS_ENTITY_ADAPTER.getSelectors();

const SELECT_ALL = createSelector(
    ATTACHED_IOS_FEATURE.selectAttachedIosState,
    ATTACHED_IOS_ADAPTER_SELECTORS.selectAll
);

const SELECT_ENTITIES = createSelector(
    ATTACHED_IOS_FEATURE.selectAttachedIosState,
    ATTACHED_IOS_ADAPTER_SELECTORS.selectEntities
);

export const ATTACHED_IO_SELECTORS = {
    selectAll: SELECT_ALL,
    selectEntities: SELECT_ENTITIES,
    selectHubIos: (hubId: string) => createSelector(
        ATTACHED_IO_SELECTORS.selectAll,
        (ios) => ios.filter((io) => io.hubId === hubId)
    ),
    selectIoAtPort: (data: { hubId: string; portId: number }) => createSelector(
        ATTACHED_IO_SELECTORS.selectEntities,
        (ios) => ios[attachedIosIdFn(data)]
    )
} as const;
