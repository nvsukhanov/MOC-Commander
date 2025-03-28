import { Action, ActionReducer, INIT, UPDATE } from '@ngrx/store';
import { defaultMergeReducer, localStorageSync } from 'ngrx-store-localstorage';
import { inject } from '@angular/core';
import { DeepPartial } from '@app/shared-misc';

import { IState } from '../../i-state';
import { AppStoreVersion } from '../../app-store-version';
import { MigrateStoreService } from '../../migrations';

type StoredKeys<TState extends object> = Array<
  | {
      [k in keyof TState]?: Array<keyof TState[k]>;
    }
  | keyof TState
>;

function applyMigrations(currentState: IState, rehydratedState: DeepPartial<IState>, action: Action): IState {
  // If appVersion is absent, it means that the local storage data version is pre-1.2.0
  // In this case we have to inject 1.1.3 (the last version before 1.2.0) to the state
  if (rehydratedState.appVersion === undefined) {
    rehydratedState.appVersion = '1.1.3';
  }

  // Migrate store if it's version is not the latest
  const storeVersion = rehydratedState['storeVersion' as keyof object] as AppStoreVersion | undefined;
  if (storeVersion !== undefined && storeVersion !== AppStoreVersion.latest) {
    // injecting in methods is a bad practice, but it seems to be the only way to get the service in a meta reducer
    const migrator = inject(MigrateStoreService);
    const migrationResult = migrator.migrateToVersion(rehydratedState, AppStoreVersion.latest);
    // eslint-disable-next-line no-console
    console.log(`Store migrated from ${rehydratedState.storeVersion} to ${migrationResult.storeVersion}`);
    return defaultMergeReducer(currentState, migrationResult, action);
  }
  return defaultMergeReducer(currentState, rehydratedState, action);
}

export function localStorageSyncMetaReducer(reducer: ActionReducer<IState>): ActionReducer<IState> {
  return localStorageSync({
    keys: [
      { hubs: ['ids', 'entities'] },
      { attachedIos: ['ids', 'entities'] },
      { controllers: ['ids', 'entities'] },
      { controllerSettings: ['ids', 'entities'] },
      { controlSchemes: ['ids', 'entities'] },
      { attachedIoModes: ['ids', 'entities'] },
      { attachedIoPortModeInfo: ['ids', 'entities'] },
      'settings',
      'storeVersion',
      'appVersion',
    ] satisfies StoredKeys<IState>,
    rehydrate: true,
    mergeReducer: (state: IState, rehydratedState: object, action: Action) => {
      if (action.type === INIT || action.type === UPDATE) {
        // TODO: find a better way to check if the state is hydrated
        const isHydrated = (v: object): v is DeepPartial<IState> => !!rehydratedState && Object.keys(rehydratedState).length > 0;

        return isHydrated(rehydratedState) ? applyMigrations(state, rehydratedState, action) : defaultMergeReducer(state, {}, action);
      }
      return state;
    },
  })(reducer);
}
