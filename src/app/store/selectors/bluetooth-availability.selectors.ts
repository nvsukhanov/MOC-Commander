import { createFeatureSelector, createSelector } from '@ngrx/store';
import { IState } from '../i-state';

export const SELECT_BLUETOOTH_AVAILABILITY_FEATURY = createFeatureSelector<IState['bluetoothAvailability']>('bluetoothAvailability');

export const SELECT_BLUETOOTH_AVAILABILITY = createSelector(
    SELECT_BLUETOOTH_AVAILABILITY_FEATURY,
    (state) => state.isAvailable
);
