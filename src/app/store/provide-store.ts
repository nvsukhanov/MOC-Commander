import { APP_INITIALIZER, EnvironmentProviders, isDevMode, makeEnvironmentProviders } from '@angular/core';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { ActionReducer, ActionReducerMap, MetaReducer, Store, provideStore } from '@ngrx/store';
import { provideRouterStore, routerReducer } from '@ngrx/router-store';
import { localStorageSync } from 'ngrx-store-localstorage';
import { Router } from '@angular/router';

import { NAVIGATOR } from '@app/shared';
import { IState } from './i-state';
import {
    HUBS_REDUCER,
    HUB_ATTACHED_IOS_REDUCER,
    HUB_ATTACHED_IO_STATE_REDUCER,
    HUB_DISCOVERY_STATE_REDUCER,
    HUB_EDIT_FORM_ACTIVE_SAVES_REDUCER,
    HUB_IO_OUTPUT_MODES_REDUCER,
    HUB_PORT_MODE_INFO_REDUCER,
    HUB_PORT_TASKS_REDUCER,
    HUB_STATS_REDUCER,
    SERVO_CALIBRATION_REDUCER
} from './reducers';
import {
    HubAttachedIOsEffects,
    HubAttachedIosStateEffects,
    HubIoSupportedModesEffects,
    HubPortModeInfoEffects,
    HubsEffects,
    NotificationsEffects,
    ServoCalibrationEffects,
} from './effects';
import { bluetoothAvailabilityCheckFactory } from './bluetooth-availability-check-factory';
import { HubStorageService } from './hub-storage.service';
import { HUB_STATS_ACTIONS } from './actions';
import { RoutesBuilderService } from '../routing';
import { CONTROLLERS_FEATURE, GAMEPAD_CONTROLLER_EFFECTS, KEYBOARD_CONTROLLER_EFFECTS } from './controllers';
import { BLUETOOTH_AVAILABILITY_FEATURE } from './bluetooth-availability';
import {
    CONTROLLER_INPUT_ACTIONS,
    CONTROLLER_INPUT_FEATURE,
    ControllerInputCaptureEffects,
    GamepadControllerInputEffects,
    KeyboardControllerInputEffects
} from './controller-input';
import { CONTROLLER_SETTINGS_FEATURE } from './controller-settings';
import { CONTROL_SCHEMES_FEATURE, ControlSchemeEffects, ControlSchemeRunnerEffects } from './control-schemes';

const STORAGE_VERSION = '2';

const REDUCERS: ActionReducerMap<IState> = {
    bluetoothAvailability: BLUETOOTH_AVAILABILITY_FEATURE.reducer,
    controllers: CONTROLLERS_FEATURE.reducer,
    controllerInput: CONTROLLER_INPUT_FEATURE.reducer,
    controllerSettings: CONTROLLER_SETTINGS_FEATURE.reducer,
    controlSchemes: CONTROL_SCHEMES_FEATURE.reducer,
    hubs: HUBS_REDUCER,
    hubStats: HUB_STATS_REDUCER,
    hubDiscoveryState: HUB_DISCOVERY_STATE_REDUCER,
    hubAttachedIos: HUB_ATTACHED_IOS_REDUCER,
    hubAttachedIoProps: HUB_ATTACHED_IO_STATE_REDUCER,
    hubIoSupportedModes: HUB_IO_OUTPUT_MODES_REDUCER,
    hubPortModeInfo: HUB_PORT_MODE_INFO_REDUCER,
    hubPortTasks: HUB_PORT_TASKS_REDUCER,
    hubEditFormActiveSaves: HUB_EDIT_FORM_ACTIVE_SAVES_REDUCER,
    servoCalibrationTaskState: SERVO_CALIBRATION_REDUCER,
    router: routerReducer
};

function localStorageSyncReducer(
    reducer: ActionReducer<IState>
): ActionReducer<IState> {
    return localStorageSync({
        keys: [
            { hubs: [ 'ids', 'entities' ] },
            { hubAttachedIos: [ 'ids', 'entities' ] },
            { controllerSettings: [ 'ids', 'entities' ] },
            { controlSchemes: [ 'ids', 'entities' ] },
            { hubIoSupportedModes: [ 'ids', 'entities' ] },
            { hubPortModeInfo: [ 'ids', 'entities' ] },
        ],
        rehydrate: true,
        storageKeySerializer: (key: string) => `${STORAGE_VERSION}/${key}`,
    })(reducer);
}

const metaReducers: Array<MetaReducer<IState>> = [ localStorageSyncReducer ];

export function provideApplicationStore(): EnvironmentProviders {
    return makeEnvironmentProviders([
        provideStore<IState>(REDUCERS, { metaReducers }),
        provideEffects(
            HubAttachedIOsEffects,
            HubPortModeInfoEffects,
            HubIoSupportedModesEffects,
            HubsEffects,
            ControlSchemeEffects,
            ControlSchemeRunnerEffects,
            NotificationsEffects,
            ServoCalibrationEffects,
            HubAttachedIosStateEffects,
            GamepadControllerInputEffects,
            KeyboardControllerInputEffects,
            ControllerInputCaptureEffects,
            GAMEPAD_CONTROLLER_EFFECTS,
            KEYBOARD_CONTROLLER_EFFECTS
        ),
        provideStoreDevtools({
            maxAge: 100,
            logOnly: !isDevMode(),
            autoPause: true,
            trace: true,
            traceLimit: 75,
            actionsBlocklist: [
                HUB_STATS_ACTIONS.setHasCommunication.type,
                HUB_STATS_ACTIONS.rssiLevelReceived.type,
                HUB_STATS_ACTIONS.batteryLevelReceived.type,
                CONTROLLER_INPUT_ACTIONS.inputReceived.type
            ]
        }),
        {
            provide: APP_INITIALIZER,
            useFactory: bluetoothAvailabilityCheckFactory,
            deps: [
                NAVIGATOR,
                Store,
                Router,
                RoutesBuilderService
            ],
            multi: true
        },
        HubStorageService,
        provideRouterStore()
    ]);
}
