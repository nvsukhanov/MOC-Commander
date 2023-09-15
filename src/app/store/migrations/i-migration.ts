import { InjectionToken } from '@angular/core';
import { DeepPartial } from '@app/shared';

import { AppStoreVersion } from '../app-store-version';

export interface IMigration<TPrev, TNext> {
    readonly fromVersion: AppStoreVersion;
    readonly toVersion: AppStoreVersion;

    migrate(prev: DeepPartial<TPrev>): DeepPartial<TNext>;
}

export const STORE_MIGRATION = new InjectionToken<IMigration<unknown, unknown>>('STORE_MIGRATION');
