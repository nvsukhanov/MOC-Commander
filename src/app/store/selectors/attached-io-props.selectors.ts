import { createSelector } from '@ngrx/store';

import { ATTACHED_IO_PROPS_ENTITY_ADAPTER, ATTACHED_IO_PROPS_FEATURE, hubAttachedIoPropsIdFn } from '../reducers';

export const ATTACHED_IO_PROPS_SELECTORS = {
    selectEntities: createSelector(
        ATTACHED_IO_PROPS_FEATURE.selectAttachedIoPropsState,
        ATTACHED_IO_PROPS_ENTITY_ADAPTER.getSelectors().selectEntities,
    ),
    selectById: (
        q: { hubId: string; portId: number }
    ) => createSelector(
        ATTACHED_IO_PROPS_SELECTORS.selectEntities,
        (entities) => entities[hubAttachedIoPropsIdFn(q)]
    ),
    selectMotorEncoderOffset: (
        q: { hubId: string; portId: number }
    ) => createSelector(
        ATTACHED_IO_PROPS_SELECTORS.selectEntities,
        (entities) => entities[hubAttachedIoPropsIdFn(q)]?.motorEncoderOffset ?? 0
    ),
} as const;
