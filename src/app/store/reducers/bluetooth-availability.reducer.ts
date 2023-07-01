import { createFeature, createReducer, on } from '@ngrx/store';

import { BLUETOOTH_AVAILABILITY_ACTIONS } from '../actions';

export const BLUETOOTH_AVAILABILITY_INITIAL_STATE: BluetoothAvailabilityState = {
    isAvailable: false
};

export type BluetoothAvailabilityState = {
    isAvailable: boolean;
};

export const BLUETOOTH_AVAILABILITY_FEATURE = createFeature({
    name: 'bluetoothAvailability',
    reducer: createReducer(
        BLUETOOTH_AVAILABILITY_INITIAL_STATE,
        on(BLUETOOTH_AVAILABILITY_ACTIONS.setBluetoothAvailability, (state, data): BluetoothAvailabilityState => (
            { ...state, isAvailable: data.isAvailable }
        ))
    )
});
