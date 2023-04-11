/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { HUB_ATTACHED_IOS_ENTITY_ADAPTER } from '../entity-adapters';
import { IState } from '../i-state';

const SELECT_HUB_ATTACHED_IOS_FEATURE = createFeatureSelector<IState['hubAttachedIOs']>('hubAttachedIOs');

const HUB_ATTACHED_IOS_ADAPTER_SELECTORS = HUB_ATTACHED_IOS_ENTITY_ADAPTER.getSelectors();

export const HUB_ATTACHED_IO_SELECTORS = {
    selectIOsAll: createSelector(SELECT_HUB_ATTACHED_IOS_FEATURE, HUB_ATTACHED_IOS_ADAPTER_SELECTORS.selectAll)
} as const;
