import { createFeatureSelector, createSelector } from '@ngrx/store';
import { IState } from '../i-state';

export const SELECT_BLUETOOTH_AVAILABILITY_FEATURE = createFeatureSelector<IState['bluetoothAvailability']>('bluetoothAvailability');

export const SELECT_BLUETOOTH_AVAILABILITY = createSelector(
    SELECT_BLUETOOTH_AVAILABILITY_FEATURE,
    (state) => state.isAvailable
);
