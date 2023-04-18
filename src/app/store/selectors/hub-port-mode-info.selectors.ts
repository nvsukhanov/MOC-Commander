import { IState } from '../i-state';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { HUB_PORT_MODE_INFO } from '../entity-adapters';

const HUB_PORT_MODE_FEATURE_SELECTOR = createFeatureSelector<IState['hubPortModeInfo']>('hubPortModeInfo');

const HUB_PORT_MODE_INFO_ENTITY_ADAPTER_SELECTORS = HUB_PORT_MODE_INFO.getSelectors();

export const HUB_PORT_MODE_INFO_SELECTORS = {
    selectAll: createSelector(HUB_PORT_MODE_FEATURE_SELECTOR, HUB_PORT_MODE_INFO_ENTITY_ADAPTER_SELECTORS.selectAll),
    selectEntities: createSelector(HUB_PORT_MODE_FEATURE_SELECTOR, HUB_PORT_MODE_INFO_ENTITY_ADAPTER_SELECTORS.selectEntities)
} as const;
