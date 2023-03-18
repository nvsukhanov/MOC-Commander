import { createReducer, on } from '@ngrx/store';
import { INITIAL_STATE } from '../initial-state';
import { ACTIONS_BLUETOOTH_AVAILABILITY } from '../actions';

export const BLUETOOTH_AVAILABILITY_REDUCERS = createReducer(
    INITIAL_STATE['bluetoothAvailability'],
    on(ACTIONS_BLUETOOTH_AVAILABILITY.setBluetoothAvailability, (state, data) => ({ ...state, isAvailable: data.isAvailable }))
);
