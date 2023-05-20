import { createFeatureSelector, createSelector } from '@ngrx/store';
import { HubDiscoveryState, IState } from '../i-state';

const HUB_DISCOVERY_STATE_FEATURE_SELECTORS = createFeatureSelector<IState['hubDiscoveryState']>('hubDiscoveryState');

export const HUB_DISCOVERY_STATE_SELECTORS = {
    isDiscoveryBusy: createSelector(HUB_DISCOVERY_STATE_FEATURE_SELECTORS, (state) => state.discoveryState !== HubDiscoveryState.Idle),
} as const;
