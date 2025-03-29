import { createSelector } from '@ngrx/store';

import { BLUETOOTH_AVAILABILITY_FEATURE } from '../reducers';

export const BLUETOOTH_AVAILABILITY_SELECTORS = {
  isAvailable: createSelector(
    BLUETOOTH_AVAILABILITY_FEATURE.selectBluetoothAvailabilityState,
    (state) => state.isAvailable,
  ),
  canViewBluetoothUnavailablePage: createSelector(
    BLUETOOTH_AVAILABILITY_FEATURE.selectBluetoothAvailabilityState,
    (state) => !state.isAvailable,
  ),
} as const;
