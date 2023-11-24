import { InjectionToken } from '@angular/core';
import { DeepPartial } from '@app/shared';

import { AppStoreVersion } from '../app-store-version';

export type StoreWithVersion = {
    storeVersion: AppStoreVersion;
};

export interface IMigration<TPrev extends StoreWithVersion, TNext extends StoreWithVersion> {
    readonly fromVersion: TPrev['storeVersion'];
    readonly toVersion: TNext['storeVersion'];

    migrate(prev: DeepPartial<TPrev>): DeepPartial<TNext>;
}

export const STORE_MIGRATION = new InjectionToken<IMigration<StoreWithVersion, StoreWithVersion>>('STORE_MIGRATION');
