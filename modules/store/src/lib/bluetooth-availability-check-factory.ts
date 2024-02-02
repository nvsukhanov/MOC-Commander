import { Store } from '@ngrx/store';

import { BLUETOOTH_AVAILABILITY_ACTIONS } from './actions';

export function bluetoothAvailabilityCheckFactory(
    navigator: Navigator,
    store: Store
): () => void {
    return (): void => {
        store.dispatch(BLUETOOTH_AVAILABILITY_ACTIONS.setBluetoothAvailability({
            isAvailable: !!navigator.bluetooth
        }));
    };
}
