import { Injectable } from '@angular/core';
import { ControlSchemeBindingType, DeepPartial } from '@app/shared';
import { AppStoreVersion } from '@app/store';

import { IMigration } from './i-migration';
import { V23ControlSchemesEntitiesState, V23Store } from './v23-store';
import { V24Store } from './v24-store';

@Injectable()
export class V23ToV24MigrationService implements IMigration<V23Store, V24Store> {
    public readonly fromVersion = AppStoreVersion.v23;

    public readonly toVersion = AppStoreVersion.v24;

    public migrate(
        prev: DeepPartial<V23Store>
    ): DeepPartial<V24Store> {
        const controlSchemes = prev.controlSchemes;
        if (!controlSchemes) {
            return {
                ...prev,
                controlSchemes: {},
                storeVersion: AppStoreVersion.v24
            };
        }
        const result: DeepPartial<V24Store> = {
            ...prev,
            controlSchemes: {
                ...controlSchemes,
                entities: {}
            },
            storeVersion: AppStoreVersion.v24
        };
        const controlSchemeEntities = Object.entries(controlSchemes.entities ?? {});
        controlSchemeEntities.forEach(([ k, controlScheme ]: [ string, V23ControlSchemesEntitiesState | undefined ]) => {
            if (!controlScheme) {
                return;
            }
            result.controlSchemes!.entities![k] = {
                ...controlScheme,
                bindings: controlScheme.bindings.map((binding) => {
                    if (binding.bindingType === ControlSchemeBindingType.Servo) {
                        return {
                            ...binding,
                            calibrateOnStart: false
                        };
                    }
                    return binding;
                })
            };
        });
        return result;
    }
}
