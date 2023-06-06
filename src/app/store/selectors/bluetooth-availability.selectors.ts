import { createFeatureSelector, createSelector } from '@ngrx/store';

import { IState } from '../i-state';

const SELECT_BLUETOOTH_AVAILABILITY_FEATURE = createFeatureSelector<IState['bluetoothAvailability']>('bluetoothAvailability');

export const BLUETOOTH_AVAILABILITY_SELECTORS = {
    isAvailable: createSelector(SELECT_BLUETOOTH_AVAILABILITY_FEATURE, (state) => state.isAvailable)
} as const;
