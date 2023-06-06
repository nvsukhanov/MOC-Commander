import { createReducer, on } from '@ngrx/store';

import { INITIAL_STATE } from '../initial-state';
import { ACTIONS_BLUETOOTH_AVAILABILITY } from '../actions';
import { IState } from '../i-state';

export const BLUETOOTH_AVAILABILITY_REDUCER = createReducer(
    INITIAL_STATE['bluetoothAvailability'],
    on(ACTIONS_BLUETOOTH_AVAILABILITY.setBluetoothAvailability, (state, data): IState['bluetoothAvailability'] => (
        { ...state, isAvailable: data.isAvailable }
    ))
);
