import { createSelector } from '@ngrx/store';

import { ATTACHED_IO_PROPS_ENTITY_ADAPTER, ATTACHED_IO_PROPS_FEATURE } from '../reducers';

export const HUB_ATTACHED_IO_STATE_SELECTORS = {
    selectEntities: createSelector(
        ATTACHED_IO_PROPS_FEATURE.selectAttachedIoPropsState,
        ATTACHED_IO_PROPS_ENTITY_ADAPTER.getSelectors().selectEntities,
    )
} as const;
