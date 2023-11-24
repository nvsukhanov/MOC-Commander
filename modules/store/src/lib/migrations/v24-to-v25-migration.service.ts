import { Injectable } from '@angular/core';
import { DeepPartial } from '@app/shared';

import { AppStoreVersion } from '../app-store-version';
import { IMigration } from './i-migration';
import { V24ControlSchemeModelWithoutWidgets, V24Store } from './v24-store';
import { V25Store } from './v25-store';

@Injectable()
export class V24ToV25MigrationService implements IMigration<V24Store, V25Store> {
    public readonly fromVersion = AppStoreVersion.v24;

    public readonly toVersion = AppStoreVersion.v25;

    public migrate(
        prev: DeepPartial<V24Store>
    ): DeepPartial<V25Store> {
        const controlSchemes = prev.controlSchemes;
        if (!controlSchemes) {
            return {
                ...prev,
                controlSchemes: {},
                storeVersion: AppStoreVersion.v25
            };
        }
        const result: DeepPartial<V25Store> = {
            ...prev,
            controlSchemes: {
                ...controlSchemes,
                entities: {}
            },
            storeVersion: AppStoreVersion.v25
        };
        const controlSchemeEntities = Object.entries(controlSchemes.entities ?? {});
        controlSchemeEntities.forEach(([ k, controlScheme ]: [ string, V24ControlSchemeModelWithoutWidgets | undefined ]) => {
            if (!controlScheme) {
                return;
            }
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            result.controlSchemes!.entities![k] = {
                ...controlScheme,
                widgets: []
            };
        });
        return result;
    }
}
