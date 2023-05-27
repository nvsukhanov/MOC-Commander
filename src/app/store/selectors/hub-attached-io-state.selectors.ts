import { HUB_ATTACHED_IO_STATE_ENTITY_ADAPTER } from '../entity-adapters';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { IState } from '../i-state';

const HUB_ATTACHED_IO_STATE_FEATURE_SELECTOR = createFeatureSelector<IState['hubAttachedIOState']>('hubAttachedIOState');

const HUB_ATTACHED_IO_STATE_ENTITTY_SELECTORS = HUB_ATTACHED_IO_STATE_ENTITY_ADAPTER.getSelectors();

export const HUB_ATTACHED_IO_STATE_SELECTORS = {
    selectEntities: createSelector(
        HUB_ATTACHED_IO_STATE_FEATURE_SELECTOR,
        HUB_ATTACHED_IO_STATE_ENTITTY_SELECTORS.selectEntities,
    )
} as const;
