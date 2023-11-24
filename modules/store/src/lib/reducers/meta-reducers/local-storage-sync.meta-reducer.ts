import { Action, ActionReducer, INIT, UPDATE } from '@ngrx/store';
import { defaultMergeReducer, localStorageSync } from 'ngrx-store-localstorage';
import { inject } from '@angular/core';
import { DeepPartial } from '@app/shared-misc';

import { IState } from '../../i-state';
import { AppStoreVersion } from '../../app-store-version';
import { MigrateStoreService } from '../../migrations';

type StoredKeys<TState extends object> = Array<{
    [k in keyof TState]?: Array<keyof TState[k]>
} | keyof TState>;

export function localStorageSyncMetaReducer(
    reducer: ActionReducer<IState>,
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
