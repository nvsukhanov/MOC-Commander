import { APP_INITIALIZER, EnvironmentProviders, Provider, isDevMode, makeEnvironmentProviders } from '@angular/core';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { Action, ActionReducerMap, Store, provideStore } from '@ngrx/store';
import { NavigationActionTiming, provideRouterStore, routerReducer } from '@ngrx/router-store';
import { Router } from '@angular/router';
import { provideControllerProfiles } from '@app/controller-profiles';
import { NAVIGATOR, RoutesBuilderService } from '@app/shared-misc';
import { COPY_TO_CLIPBOARD_HANDLER } from '@app/shared-ui';

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
    APP_UPDATE_EFFECTS,
    AttachedIOsEffects,
    AttachedIoModesEffects,
    COMMON_EFFECTS,
    CONTROLLER_EFFECTS,
    HUB_EFFECTS,
    HubAttachedIosStateEffects,
    HubPortModeInfoEffects,
    NotificationsEffects,
    SETTINGS_EFFECTS,
    TASK_PROCESSING_EFFECTS
} from './effects';
import { bluetoothAvailabilityCheckFactory } from './bluetooth-availability-check-factory';
import { HubStorageService } from './hub-storage.service';
import { APP_UPDATE_ACTIONS, HUB_RUNTIME_DATA_ACTIONS } from './actions';
import { HubMotorPositionFacadeService, HubServoCalibrationFacadeService } from './hub-facades';
import { provideStoreMigrations } from './migrations';
import { ControllerProfilesFacadeService } from './controller-profiles-facade.service';
import { AppStoreVersion } from './app-store-version';
// eslint-disable-next-line @nx/enforce-module-boundaries
import packageJson from '../../../../package.json';
import { CopyToClipboardHandlerService } from './copy-to-clipboard-handler.service';

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
    storeVersion: (state?: AppStoreVersion) => state ?? AppStoreVersion.latest,
    appVersion: (state: string | undefined, action: Action) => {
        if (action.type === APP_UPDATE_ACTIONS.appUpdated.type) {
            return (action as ReturnType<typeof APP_UPDATE_ACTIONS.appUpdated>).current;
        }
        return state ?? packageJson.version;
    }
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
                HUB_EFFECTS,
                TASK_PROCESSING_EFFECTS,
                COMMON_EFFECTS,
                APP_UPDATE_EFFECTS
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
            { provide: COPY_TO_CLIPBOARD_HANDLER, useClass: CopyToClipboardHandlerService },
            provideRouterStore({
                navigationActionTiming: NavigationActionTiming.PostActivation
            }),
            provideStoreMigrations(),
            provideControllerProfiles()
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
            , connectInZone: true}),
        );
    }
    return makeEnvironmentProviders(providers);
}
