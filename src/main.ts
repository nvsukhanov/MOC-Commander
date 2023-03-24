import { bootstrapApplication } from '@angular/platform-browser';
import { LayoutComponent } from './app/main/layout';
import { provideRouter } from '@angular/router';
import { ROUTES } from './app/routes';
import { provideL10n } from './app/l10n';
import { provideStore, Store } from '@ngrx/store';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import {
    BLUETOOTH_AVAILABILITY_REDUCERS,
    bluetoothAvailabilityCheckFactory,
    CONFIGURE_CONTROLLER_REDUCER,
    CONFIGURE_HUB_REDUCERS,
    ConfigureControllerEffects,
    ConfigureHubEffects,
    IState
} from './app/store';
import { provideEffects } from '@ngrx/effects';
import { APP_INITIALIZER, importProvidersFrom, isDevMode } from '@angular/core';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideGamepadsPlugins } from './app/plugins';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { provideLpu } from './app/lego-hub';
import { NAVIGATOR } from './app/types';
import { BluetoothAvailabilityGuardService } from './app/bluetooth-availability';

bootstrapApplication(LayoutComponent, {
    providers: [
        provideRouter(ROUTES),
        provideL10n(), // TODO: replace later with a proper l10n library e.g. angular-l10n
        provideStore<IState>({
            controller: CONFIGURE_CONTROLLER_REDUCER,
            hub: CONFIGURE_HUB_REDUCERS,
            bluetoothAvailability: BLUETOOTH_AVAILABILITY_REDUCERS
        }),
        provideEffects(
            ConfigureControllerEffects,
            ConfigureHubEffects
        ),
        provideNoopAnimations(),
        provideGamepadsPlugins(),
        provideStoreDevtools({
            maxAge: 25,
            logOnly: !isDevMode(),
            autoPause: true,
            trace: false,
            traceLimit: 75,
        }),
        importProvidersFrom(MatSnackBarModule),
        provideLpu(),
        { provide: APP_INITIALIZER, useFactory: bluetoothAvailabilityCheckFactory, deps: [ NAVIGATOR, Store ], multi: true },
        BluetoothAvailabilityGuardService
    ]
});
