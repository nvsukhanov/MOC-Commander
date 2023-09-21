import { APP_INITIALIZER, EnvironmentProviders, Provider, inject, isDevMode, makeEnvironmentProviders } from '@angular/core';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { Action, ActionReducer, ActionReducerMap, INIT, MetaReducer, Store, UPDATE, provideStore } from '@ngrx/store';
import { provideRouterStore, routerReducer } from '@ngrx/router-store';
import { defaultMergeReducer, localStorageSync } from 'ngrx-store-localstorage';
import { Router } from '@angular/router';
import { RoutesBuilderService } from '@app/routing';
import { DeepPartial, NAVIGATOR } from '@app/shared';

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
    HUBS_FEATURE,
    HUB_EDIT_FORM_ACTIVE_SAVES_FEATURE,
    HUB_STATS_FEATURE,
    PORT_TASKS_FEATURE,
    SETTINGS_FEATURE,
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
import { HUB_STATS_ACTIONS } from './actions';
import { HubFacadeService } from './hub-facade.service';
import { AppStoreVersion } from './app-store-version';
import { MigrateStoreService, provideStoreMigrations } from './migrations';
import { ControllerProfilesFacadeService } from './controller-profiles-facade.service';

const REDUCERS: ActionReducerMap<IState> = {
    bluetoothAvailability: BLUETOOTH_AVAILABILITY_FEATURE.reducer,
    controllers: CONTROLLERS_FEATURE.reducer,
    controllerInput: CONTROLLER_INPUT_FEATURE.reducer,
    controllerSettings: CONTROLLER_SETTINGS_FEATURE.reducer,
    controllerConnections: CONTROLLER_CONNECTION_FEATURE.reducer,
    controlSchemes: CONTROL_SCHEME_FEATURE.reducer,
    hubs: HUBS_FEATURE.reducer,
    hubStats: HUB_STATS_FEATURE.reducer,
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

type StoredKeys<TState extends object> = Array<{
    [k in keyof TState]?: Array<keyof TState[k]>
} | keyof TState>;

function localStorageSyncReducer(
    reducer: ActionReducer<IState>
): ActionReducer<IState> {
    return localStorageSync({
        keys: [
            { hubs: [ 'ids', 'entities' ] },
            { attachedIos: [ 'ids', 'entities' ] },
            { controllers: [ 'ids', 'entities' ] },
            { controllerSettings: [ 'ids', 'entities' ] },
            { controlSchemes: [ 'ids', 'entities' ] },
            { attachedIoModes: [ 'ids', 'entities' ] },
            { attachedIoPortModeInfo: [ 'ids', 'entities' ] },
            'settings',
            'storeVersion'
        ] satisfies StoredKeys<IState>,
        rehydrate: true,
        mergeReducer: (state: IState, rehydratedState: object, action: Action) => {
            if (action.type === INIT || action.type === UPDATE) {
                const isHydrated = (v: object): v is DeepPartial<IState> => !!rehydratedState && Object.keys(rehydratedState).length > 0;
                const storeVersionKey: keyof IState = 'storeVersion';
                if (isHydrated(rehydratedState)) {
                    if (!Object.hasOwn(rehydratedState, storeVersionKey)) {
                        // eslint-disable-next-line no-console
                        console.log('Store version not found in local storage, assuming first version');
                        rehydratedState.storeVersion = AppStoreVersion.first;
                        return defaultMergeReducer(state, rehydratedState, action);
                    }
                    if ((rehydratedState as DeepPartial<IState>).storeVersion !== AppStoreVersion.latest) {
                        // injecting in methods is a bad practice, but it seems to be the only way to get the service in a meta reducer
                        const migrator = inject(MigrateStoreService);
                        const migrationResult = migrator.migrateToVersion(rehydratedState, AppStoreVersion.latest);
                        // eslint-disable-next-line no-console
                        console.log(`Store migrated from ${rehydratedState.storeVersion} to ${migrationResult.storeVersion}`);
                        return defaultMergeReducer(state, migrationResult, action);
                    }
                }
                return defaultMergeReducer(state, rehydratedState, action);
            }
            return state;
        }
    })(reducer);
}

const metaReducers: Array<MetaReducer<IState>> = [ localStorageSyncReducer ];

export function provideApplicationStore(): EnvironmentProviders {
    const providers: (Provider | EnvironmentProviders)[] = [
        [
            provideStore<IState>(REDUCERS, { metaReducers }),
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
            HubFacadeService,
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
                    HUB_STATS_ACTIONS.setHasCommunication.type,
                    HUB_STATS_ACTIONS.rssiLevelReceived.type,
                    HUB_STATS_ACTIONS.batteryLevelReceived.type,
                    // CONTROLLER_INPUT_ACTIONS.inputReceived.type
                ]
            }),
        );
    }
    return makeEnvironmentProviders(providers);
}
