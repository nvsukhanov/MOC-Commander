import { APP_INITIALIZER, EnvironmentProviders, Provider, isDevMode, makeEnvironmentProviders } from '@angular/core';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { ActionReducerMap, Store, provideStore } from '@ngrx/store';
import { provideRouterStore, routerReducer } from '@ngrx/router-store';
import { Router } from '@angular/router';
import { RoutesBuilderService } from '@app/routing';
import { NAVIGATOR } from '@app/shared';

import { IState } from './i-state';
import {
    ATTACHED_IOS_FEATURE,
    ATTACHED_IO_MODES_FEATURE,
    ATTACHED_IO_PORT_MODE_INFO_FEATURE,
    ATTACHED_IO_PROPS_FEATURE,
    BLUETOOTH_AVAILABILITY_FEATURE,
    CONTROLLERS_FEATURE,
    CONTROLLER_CONNECTION_FEATURE,
    CONTROLLER_INPUT_FEATURE,
    CONTROLLER_SETTINGS_FEATURE,
    CONTROL_SCHEME_FEATURE,
    CONTROL_SCHEME_WIDGET_DATA_FEATURE,
    HUBS_FEATURE,
    HUB_EDIT_FORM_ACTIVE_SAVES_FEATURE,
    HUB_RUNTIME_DATA_FEATURE,
    PORT_TASKS_FEATURE,
    SETTINGS_FEATURE,
    localStorageSyncMetaReducer,
    stateResetMetaReducer,
    stateRestoreMetaReducer
} from './reducers';
import {
    AttachedIOsEffects,
    AttachedIoModesEffects,
    CONTROLLER_EFFECTS,
    CONTROL_SCHEME_EFFECTS,
    HUB_EFFECTS,
    HubAttachedIosStateEffects,
    HubPortModeInfoEffects,
    NotificationsEffects,
    SETTINGS_EFFECTS,
    TASK_PROCESSING_EFFECTS,
    provideTaskFactories,
    provideTaskFilter
} from './effects';
import { bluetoothAvailabilityCheckFactory } from './bluetooth-availability-check-factory';
import { HubStorageService } from './hub-storage.service';
import { HUB_RUNTIME_DATA_ACTIONS } from './actions';
import { HubMotorPositionFacadeService, HubServoCalibrationFacadeService } from './hub-facades';
import { AppStoreVersion } from './app-store-version';
import { provideStoreMigrations } from './migrations';
import { ControllerProfilesFacadeService } from './controller-profiles-facade.service';

const REDUCERS: ActionReducerMap<IState> = {
    bluetoothAvailability: BLUETOOTH_AVAILABILITY_FEATURE.reducer,
    controllers: CONTROLLERS_FEATURE.reducer,
    controllerInput: CONTROLLER_INPUT_FEATURE.reducer,
    controllerSettings: CONTROLLER_SETTINGS_FEATURE.reducer,
    controllerConnections: CONTROLLER_CONNECTION_FEATURE.reducer,
    controlSchemes: CONTROL_SCHEME_FEATURE.reducer,
    controlSchemeWidgetsData: CONTROL_SCHEME_WIDGET_DATA_FEATURE.reducer,
    hubs: HUBS_FEATURE.reducer,
    hubRuntimeData: HUB_RUNTIME_DATA_FEATURE.reducer,
    attachedIos: ATTACHED_IOS_FEATURE.reducer,
    attachedIoProps: ATTACHED_IO_PROPS_FEATURE.reducer,
    attachedIoModes: ATTACHED_IO_MODES_FEATURE.reducer,
    attachedIoPortModeInfo: ATTACHED_IO_PORT_MODE_INFO_FEATURE.reducer,
    hubEditFormActiveSaves: HUB_EDIT_FORM_ACTIVE_SAVES_FEATURE.reducer,
    portTasks: PORT_TASKS_FEATURE.reducer,
    router: routerReducer,
    settings: SETTINGS_FEATURE.reducer,
    storeVersion: (state?: AppStoreVersion) => state ?? AppStoreVersion.latest
};

export function provideApplicationStore(): EnvironmentProviders {
    const providers: (Provider | EnvironmentProviders)[] = [
        [
            provideStore<IState>(REDUCERS, {
                metaReducers: [
                    localStorageSyncMetaReducer,
                    stateRestoreMetaReducer,
                    stateResetMetaReducer
                ]
            }),
            provideEffects(
                AttachedIOsEffects,
                HubPortModeInfoEffects,
                AttachedIoModesEffects,
                NotificationsEffects,
                HubAttachedIosStateEffects,
                CONTROLLER_EFFECTS,
                SETTINGS_EFFECTS,
                CONTROL_SCHEME_EFFECTS,
                HUB_EFFECTS,
                TASK_PROCESSING_EFFECTS
            ),
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
            HubMotorPositionFacadeService,
            HubServoCalibrationFacadeService,
            ControllerProfilesFacadeService,
            provideRouterStore(),
            provideTaskFactories(),
            provideTaskFilter(),
            provideStoreMigrations()
        ]
    ];
    if (isDevMode()) {
        providers.push(
            provideStoreDevtools({
                maxAge: 100,
                logOnly: !isDevMode(),
                autoPause: true,
                trace: true,
                traceLimit: 75,
                actionsBlocklist: [
                    HUB_RUNTIME_DATA_ACTIONS.setHasCommunication.type,
                    HUB_RUNTIME_DATA_ACTIONS.rssiLevelReceived.type,
                    HUB_RUNTIME_DATA_ACTIONS.batteryLevelReceived.type,
                    // CONTROLLER_INPUT_ACTIONS.inputReceived.type
                ]
            }),
        );
    }
    return makeEnvironmentProviders(providers);
}
