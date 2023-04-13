import { APP_INITIALIZER, EnvironmentProviders, isDevMode, makeEnvironmentProviders } from '@angular/core';
import { IState } from './i-state';
import {
    BLUETOOTH_AVAILABILITY_REDUCERS,
    CONTROL_SCHEME_REDUCERS,
    GAMEPAD_AXES_STATE_REDUCERS,
    GAMEPAD_BUTTONS_STATE_REDUCERS,
    GAMEPAD_REDUCERS,
    HUB_ATTACHED_IOS_REDUCERS,
    HUB_IO_DATA_REDUCERS,
    HUB_IO_OUTPUT_MODES_REDUCER,
    HUB_PORT_MODE_INFO_REDUCERS,
    HUBS_REDUCERS
} from './reducers';
import { provideEffects } from '@ngrx/effects';
import { GamepadEffects, HubAttachedIOsEffects, HubIoDataEffects, HubIOSupportedModesEffects, HubPortModeInfoEffects, HubsEffects, } from './effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { bluetoothAvailabilityCheckFactory } from './bluetooth-availability-check-factory';
import { NAVIGATOR } from '../types';
import { provideStore, Store } from '@ngrx/store';
import { HubStorageService } from './hub-storage.service';
import { provideRouterStore, routerReducer } from '@ngrx/router-store';

export function provideApplicationStore(): EnvironmentProviders {
    return makeEnvironmentProviders([
        provideStore<IState>({
            controlSchemes: CONTROL_SCHEME_REDUCERS,
            gamepads: GAMEPAD_REDUCERS,
            gamepadAxesState: GAMEPAD_AXES_STATE_REDUCERS,
            gamepadButtonsState: GAMEPAD_BUTTONS_STATE_REDUCERS,
            hubs: HUBS_REDUCERS,
            hubAttachedIOs: HUB_ATTACHED_IOS_REDUCERS,
            hubIOSupportedModes: HUB_IO_OUTPUT_MODES_REDUCER,
            hubIOdata: HUB_IO_DATA_REDUCERS,
            hubPortModeInfo: HUB_PORT_MODE_INFO_REDUCERS,
            bluetoothAvailability: BLUETOOTH_AVAILABILITY_REDUCERS,
            router: routerReducer
        }),
        provideEffects(
            GamepadEffects,
            HubAttachedIOsEffects,
            HubPortModeInfoEffects,
            HubIoDataEffects,
            HubIOSupportedModesEffects,
            HubsEffects,
        ),
        provideStoreDevtools({
            maxAge: 100,
            logOnly: !isDevMode(),
            autoPause: true,
            trace: false,
            traceLimit: 75,
        }),
        { provide: APP_INITIALIZER, useFactory: bluetoothAvailabilityCheckFactory, deps: [ NAVIGATOR, Store ], multi: true },
        HubStorageService,
        provideRouterStore()
    ]);
}
