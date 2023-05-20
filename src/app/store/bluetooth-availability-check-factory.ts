import { Store } from '@ngrx/store';
import { ACTIONS_BLUETOOTH_AVAILABILITY } from './actions';
import { Router } from '@angular/router';
import { ROUTE_PATHS } from '../routes';

export function bluetoothAvailabilityCheckFactory(
    navigator: Navigator,
    store: Store,
    router: Router
): () => void {
    return (): void => {
        const isAvailable = !!navigator.bluetooth;
        store.dispatch(ACTIONS_BLUETOOTH_AVAILABILITY.setBluetoothAvailability({ isAvailable }));
        if (!isAvailable) {
            router.navigate([ ROUTE_PATHS.bluetoothUnavailable ]);
        }
    };
}
