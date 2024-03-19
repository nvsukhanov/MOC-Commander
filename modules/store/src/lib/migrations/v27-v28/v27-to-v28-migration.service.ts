import { Injectable } from '@angular/core';
import { ControllerInputType } from '@app/controller-profiles';
import { ControlSchemeBindingType, DeepPartial } from '@app/shared-misc';

import { AppStoreVersion } from '../../app-store-version';
import { IMigration } from '../i-migration';
import { V27ControlSchemesEntitiesState, V27Store, V28Binding } from './v27-store';
import { V28Store } from '../v28-v29/v28-store';
import { InputDirection } from '../../models';
import { OldInputAction } from '../old-input-actions';

@Injectable()
export class V27ToV28MigrationService implements IMigration<V27Store, V28Store> {
    public readonly fromVersion = AppStoreVersion.v27;

    public readonly toVersion = AppStoreVersion.v28;

    public migrate(
        prev: DeepPartial<V27Store>
    ): DeepPartial<V28Store> {
        const controlSchemes = prev.controlSchemes;
        if (!controlSchemes) {
            return {
                ...prev,
                controlSchemes: {},
                storeVersion: AppStoreVersion.v28
            };
        }
        const result: DeepPartial<V28Store> = {
            ...prev,
            controlSchemes: {
                ...controlSchemes,
                entities: {}
            },
            storeVersion: AppStoreVersion.v28
        };
        const controlSchemeEntities = Object.entries(controlSchemes.entities ?? {});
        controlSchemeEntities.forEach(([ k, controlScheme ]: [ string, V27ControlSchemesEntitiesState | undefined ]) => {
            if (!controlScheme) {
                return;
            }
            const bindings: V28Binding[] = controlScheme.bindings.map((b) => {
                if (b.bindingType === ControlSchemeBindingType.Servo) {
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    const { invert, ...remainingBindingData } = b ;
                    switch (b.inputs[OldInputAction.Servo].inputType) {
                        case ControllerInputType.Button:
                        case ControllerInputType.ButtonGroup:
                        case ControllerInputType.Trigger:
                            return {
                                ...remainingBindingData,
                                inputs: {
                                    [OldInputAction.ServoCw]: b.inputs[OldInputAction.Servo],
                                }
                            };
                        case ControllerInputType.Axis:
                            return {
                                ...remainingBindingData,
                                inputs: {
                                    [OldInputAction.ServoCw]: {
                                        ...b.inputs[OldInputAction.Servo],
                                        inputDirection: InputDirection.Positive
                                    },
                                    [OldInputAction.ServoCcw]: {
                                        ...b.inputs[OldInputAction.Servo],
                                        inputDirection: InputDirection.Negative
                                    }
                                }
                            };
                    }
                }
                return b;
            });

            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            result.controlSchemes!.entities![k] = {
                ...controlScheme,
                bindings
            };
        });
        return result;
    }
}
