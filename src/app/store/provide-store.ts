import { APP_INITIALIZER, EnvironmentProviders, isDevMode, makeEnvironmentProviders } from '@angular/core';
import { IState } from './i-state';
import { BLUETOOTH_AVAILABILITY_REDUCERS, CONFIGURE_CONTROLLER_REDUCER, CONFIGURE_HUB_REDUCERS } from './reducers';
import { provideEffects } from '@ngrx/effects';
import { ConfigureControllerEffects, ConfigureHubEffects } from './effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { bluetoothAvailabilityCheckFactory } from './bluetooth-availability-check-factory';
import { NAVIGATOR } from '../types';
import { provideStore, Store } from '@ngrx/store';
import { LpuHubStorageService } from './lpu-hub-storage.service';

export function provideApplicationStore(): EnvironmentProviders {
    return makeEnvironmentProviders([
        provideStore<IState>({
            controller: CONFIGURE_CONTROLLER_REDUCER,
            hub: CONFIGURE_HUB_REDUCERS,
            bluetoothAvailability: BLUETOOTH_AVAILABILITY_REDUCERS
        }),
        provideEffects(
            ConfigureControllerEffects,
            ConfigureHubEffects
        ),
        provideStoreDevtools({
            maxAge: 25,
            logOnly: !isDevMode(),
            autoPause: true,
            trace: false,
            traceLimit: 75,
        }),
        { provide: APP_INITIALIZER, useFactory: bluetoothAvailabilityCheckFactory, deps: [ NAVIGATOR, Store ], multi: true },
        LpuHubStorageService
    ]);
}
