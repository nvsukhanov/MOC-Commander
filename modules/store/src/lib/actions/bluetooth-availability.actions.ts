import { createActionGroup, props } from '@ngrx/store';

export const BLUETOOTH_AVAILABILITY_ACTIONS = createActionGroup({
    source: 'Bluetooth Availability',
    events: {
        setBluetoothAvailability: props<{ isAvailable: boolean }>(),
    }
});
