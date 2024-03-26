import { Injectable } from '@angular/core';
import { DeepPartial } from '@app/shared-misc';

import { AppStoreVersion } from '../../app-store-version';
import { IMigration } from '../i-migration';
import { GamepadPollingRate } from '../../models';
import { V31Store } from '.';
import { V32Store } from '../v32';

@Injectable()
export class V31ToV32MigrationService implements IMigration<V31Store, V32Store> {
    public readonly fromVersion = AppStoreVersion.v31;

    public readonly toVersion = AppStoreVersion.v32;

    public migrate(
        prev: DeepPartial<V31Store>
    ): DeepPartial<V32Store> {
        return {
            ...prev,
            settings: {
                ...(prev.settings ?? {}),
                gamepadPollingRate: GamepadPollingRate.Default
            },
            storeVersion: this.toVersion
        };
    }
}
