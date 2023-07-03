import { APP_INITIALIZER, EnvironmentProviders, isDevMode, makeEnvironmentProviders } from '@angular/core';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { ActionReducer, ActionReducerMap, MetaReducer, Store, provideStore } from '@ngrx/store';
import { provideRouterStore, routerReducer } from '@ngrx/router-store';
import { localStorageSync } from 'ngrx-store-localstorage';
import { Router } from '@angular/router';

import { IState } from './i-state';
import {
    ATTACHED_IOS_FEATURE,
    ATTACHED_IO_MODES_FEATURE,
    ATTACHED_IO_PORT_MODE_INFO_FEATURE,
    ATTACHED_IO_PROPS_FEATURE,
    BLUETOOTH_AVAILABILITY_FEATURE,
    CONTROLLERS_FEATURE,
    CONTROLLER_INPUT_FEATURE,
    CONTROLLER_SETTINGS_FEATURE,
    CONTROL_SCHEMES_FEATURE,
    HUBS_FEATURE,
    HUB_EDIT_FORM_ACTIVE_SAVES_FEATURE,
    HUB_PORT_TASKS_FEATURE,
    HUB_STATS_FEATURE,
} from './reducers';
import {
    AttachedIOsEffects,
    AttachedIoModesEffects,
    ControlSchemeEffects,
    ControlSchemeRunnerEffects,
    ControllerInputCaptureEffects,
    GAMEPAD_CONTROLLER_EFFECTS,
    GamepadControllerInputEffects,
    HubAttachedIosStateEffects,
    HubPortModeInfoEffects,
    HubsEffects,
    KEYBOARD_CONTROLLER_EFFECTS,
    KeyboardControllerInputEffects,
    NotificationsEffects,
} from './effects';
import { bluetoothAvailabilityCheckFactory } from './bluetooth-availability-check-factory';
import { HubStorageService } from './hub-storage.service';
import { RoutesBuilderService } from '../routing';
import { CONTROLLER_INPUT_ACTIONS, HUB_STATS_ACTIONS } from './actions';
import { NAVIGATOR } from '@app/shared';

const STORAGE_VERSION = '4';

const REDUCERS: ActionReducerMap<IState> = {
    bluetoothAvailability: BLUETOOTH_AVAILABILITY_FEATURE.reducer,
    controllers: CONTROLLERS_FEATURE.reducer,
    controllerInput: CONTROLLER_INPUT_FEATURE.reducer,
    controllerSettings: CONTROLLER_SETTINGS_FEATURE.reducer,
    controlSchemes: CONTROL_SCHEMES_FEATURE.reducer,
    hubs: HUBS_FEATURE.reducer,
    hubStats: HUB_STATS_FEATURE.reducer,
    attachedIos: ATTACHED_IOS_FEATURE.reducer,
    attachedIoProps: ATTACHED_IO_PROPS_FEATURE.reducer,
    attachedIoModes: ATTACHED_IO_MODES_FEATURE.reducer,
    attachedIoPortModeInfo: ATTACHED_IO_PORT_MODE_INFO_FEATURE.reducer,
    hubPortTasks: HUB_PORT_TASKS_FEATURE.reducer,
    hubEditFormActiveSaves: HUB_EDIT_FORM_ACTIVE_SAVES_FEATURE.reducer,
    router: routerReducer
};

function localStorageSyncReducer(
    reducer: ActionReducer<IState>
): ActionReducer<IState> {
    return localStorageSync({
        keys: [
            { hubs: [ 'ids', 'entities' ] },
            { attachedIos: [ 'ids', 'entities' ] },
            { controllerSettings: [ 'ids', 'entities' ] },
            { controlSchemes: [ 'ids', 'entities' ] },
            { attachedIoModes: [ 'ids', 'entities' ] },
            { attachedIoPortModeInfo: [ 'ids', 'entities' ] },
        ], // TODO: add types for this
        rehydrate: true,
        storageKeySerializer: (key: string) => `${STORAGE_VERSION}/${key}`,
    })(reducer);
}

const metaReducers: Array<MetaReducer<IState>> = [ localStorageSyncReducer ];

export function provideApplicationStore(): EnvironmentProviders {
    return makeEnvironmentProviders([
        provideStore<IState>(REDUCERS, { metaReducers }),
        provideEffects(
            AttachedIOsEffects,
            HubPortModeInfoEffects,
            AttachedIoModesEffects,
            HubsEffects,
            ControlSchemeEffects,
            ControlSchemeRunnerEffects,
            NotificationsEffects,
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
