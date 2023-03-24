import { Store } from '@ngrx/store';
import { ACTIONS_BLUETOOTH_AVAILABILITY } from './actions';

export function bluetoothAvailabilityCheckFactory(
    navigator: Navigator,
    store: Store
): () => void {
    return (): void => {
        const isAvailable = !!navigator.bluetooth;
        store.dispatch(ACTIONS_BLUETOOTH_AVAILABILITY.setBluetoothAvailability({ isAvailable }));
    };
}
