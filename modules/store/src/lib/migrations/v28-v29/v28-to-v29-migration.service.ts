import { Injectable } from '@angular/core';
import { DeepPartial } from '@app/shared-misc';

import { AppStoreVersion } from '../../app-store-version';
import { IMigration } from '../i-migration';
import { V28Store } from './v28-store';
import { V29Store } from '../v29-v30';

@Injectable()
export class V28ToV29MigrationService implements IMigration<V28Store, V29Store> {
  public readonly fromVersion = AppStoreVersion.v28;

  public readonly toVersion = AppStoreVersion.v29;

  public migrate(prev: DeepPartial<V28Store>): DeepPartial<V29Store> {
    return {
      ...prev,
      settings: {
        ...(prev.settings ?? {}),
        useLinuxCompat: null,
      },
      storeVersion: AppStoreVersion.v29,
    };
  }
}
