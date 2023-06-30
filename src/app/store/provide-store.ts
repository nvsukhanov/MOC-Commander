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
    BLUETOOTH_AVAILABILITY_REDUCER,
    CONTROLLERS_REDUCER,
    CONTROLLER_INPUT_CAPTURE_REDUCER,
    CONTROLLER_INPUT_REDUCER,
    CONTROLLER_SETTINGS_REDUCER,
    CONTROL_SCHEME_CONFIGURATION_STATE_REDUCER,
    CONTROL_SCHEME_REDUCER,
    CONTROL_SCHEME_RUNNING_STATE_REDUCER,
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
    ControlSchemeEffects,
    ControlSchemeRunnerEffects,
    ControllerInputCaptureEffects,
    GamepadControllerEffects,
    HubAttachedIOsEffects,
    HubAttachedIosStateEffects,
    HubIoSupportedModesEffects,
    HubPortModeInfoEffects,
    HubsEffects,
    KeyboardControllerEffects,
    NotificationsEffects,
    ServoCalibrationEffects,
} from './effects';
import { bluetoothAvailabilityCheckFactory } from './bluetooth-availability-check-factory';
import { HubStorageService } from './hub-storage.service';
import { CONTROLLER_INPUT_ACTIONS, HUB_STATS_ACTIONS } from './actions';
import { RoutesBuilderService } from '../routing';

const STORAGE_VERSION = '2';

const REDUCERS: ActionReducerMap<IState> = {
    controllers: CONTROLLERS_REDUCER,
    controllerInput: CONTROLLER_INPUT_REDUCER,
    controllerInputCapture: CONTROLLER_INPUT_CAPTURE_REDUCER,
    controllerSettings: CONTROLLER_SETTINGS_REDUCER,
    controlSchemes: CONTROL_SCHEME_REDUCER,
    controlSchemeConfigurationState: CONTROL_SCHEME_CONFIGURATION_STATE_REDUCER,
    controlSchemeRunningState: CONTROL_SCHEME_RUNNING_STATE_REDUCER,
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
    bluetoothAvailability: BLUETOOTH_AVAILABILITY_REDUCER,
    router: routerReducer
};

function localStorageSyncReducer(
    reducer: ActionReducer<IState>
): ActionReducer<IState> {
    return localStorageSync({
        keys: [
            'hubs',
            'hubAttachedIos',
            'controllerSettings',
            'controlSchemes',
            'hubIoSupportedModes',
            'hubPortModeInfo',
        ] satisfies Array<keyof IState>,
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
            GamepadControllerEffects,
            KeyboardControllerEffects,
            ControllerInputCaptureEffects,
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
