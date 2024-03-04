import { Injectable } from '@angular/core';
import { DeepPartial } from '@app/shared-misc';

import { AppStoreVersion } from '../../app-store-version';
import { IMigration } from '../i-migration';
import { V25ControlSchemesEntitiesState, V25Store } from './v25-store';
import { V26Store } from '../v26-v27';
import { InputDirection } from '../../models';

@Injectable()
export class V25ToV26MigrationService implements IMigration<V25Store, V26Store> {
    public readonly fromVersion = AppStoreVersion.v25;

    public readonly toVersion = AppStoreVersion.v26;

    public migrate(
        prev: DeepPartial<V25Store>
    ): DeepPartial<V26Store> {
        const controlSchemes = prev.controlSchemes;
        if (!controlSchemes) {
            return {
                ...prev,
                controlSchemes: {},
                storeVersion: AppStoreVersion.v26
            };
        }

        const result: DeepPartial<V26Store> = {
            ...prev,
            controlSchemes: {
                ...controlSchemes,
                entities: {}
            },
            storeVersion: AppStoreVersion.v26
        };
        const controlSchemeEntities = Object.entries(controlSchemes.entities ?? {});
        controlSchemeEntities.forEach(([ , controlScheme ]: [ string, V25ControlSchemesEntitiesState | undefined ]) => {
            if (!controlScheme) {
                return;
            }
            const bindings = controlScheme.bindings;
            bindings.forEach((binding) => {
                const inputEntries = Object.entries(binding.inputs);
                inputEntries.forEach(([inputAction, input]) => {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    binding.inputs[inputAction as unknown as ControlSchemeInputAction] = {
                        ...input,
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore
                        inputDirection: input['inputDirection'] === undefined ? InputDirection.Positive : input['inputDirection']
                    };
                });
            });
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            result.controlSchemes.entities[controlScheme.name] = controlScheme;
        });
        return result;
    }
}
