import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { RoutesBuilderService } from '@app/shared-misc';

import { BLUETOOTH_AVAILABILITY_ACTIONS } from './actions';

export function bluetoothAvailabilityCheckFactory(
    navigator: Navigator,
    store: Store,
    router: Router,
    routesBuilderService: RoutesBuilderService
): () => void {
    return (): void => {
        const isAvailable = !!navigator.bluetooth;
        store.dispatch(BLUETOOTH_AVAILABILITY_ACTIONS.setBluetoothAvailability({ isAvailable }));
        if (!isAvailable) {
            router.navigate(routesBuilderService.bluetoothUnavailable);
        }
    };
}
