import { Injectable } from '@angular/core';
import { ControllerInputType } from '@app/controller-profiles';
import { ControlSchemeBindingType, DeepPartial } from '@app/shared-misc';

import { AppStoreVersion } from '../../app-store-version';
import { IMigration } from '../i-migration';
import { ControlSchemeInputAction, InputDirection } from '../../models';
import { V29ControlSchemesEntitiesState, V29Store, V30Binding, V30SetSpeedBinding } from './v29-store';
import { V30Store } from '../v30';

@Injectable()
export class V29ToV30MigrationService implements IMigration<V29Store, V30Store> {
    public readonly fromVersion = AppStoreVersion.v29;

    public readonly toVersion = AppStoreVersion.v30;

    public migrate(
        prev: DeepPartial<V29Store>
    ): DeepPartial<V30Store> {
        const controlSchemes = prev.controlSchemes;
        if (!controlSchemes) {
            return {
                ...prev,
                controlSchemes: {},
                storeVersion: AppStoreVersion.v30
            };
        }
        const result: DeepPartial<V30Store> = {
            ...prev,
            controlSchemes: {
                ...controlSchemes,
                entities: {}
            },
            storeVersion: AppStoreVersion.v30
        };
        const controlSchemeEntities = Object.entries(controlSchemes.entities ?? {});
        controlSchemeEntities.forEach(([ k, controlScheme ]: [ string, V29ControlSchemesEntitiesState | undefined ]) => {
            if (!controlScheme) {
                return;
            }
            const bindings: V30Binding[] = controlScheme.bindings.map((b) => {
                if (b.bindingType === ControlSchemeBindingType.SetSpeed) {
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    const inputsResult: V30SetSpeedBinding = {
                        ...b,
                        inputs:{}
                    };
                    if (b.inputs[ControlSchemeInputAction.OldSetSpeedBrake]) {
                        inputsResult.inputs[ControlSchemeInputAction.Brake] = {
                            ...b.inputs[ControlSchemeInputAction.OldSetSpeedBrake]
                        };
                    }
                    switch (b.inputs[ControlSchemeInputAction.Accelerate].inputType) {
                        case ControllerInputType.Button:
                        case ControllerInputType.ButtonGroup:
                        case ControllerInputType.Trigger:
                            inputsResult.inputs[ControlSchemeInputAction.Forwards] = {
                                ...b.inputs[ControlSchemeInputAction.Accelerate]
                            };
                            break;
                        case ControllerInputType.Axis:
                            inputsResult.inputs[ControlSchemeInputAction.Forwards] = {
                                ...b.inputs[ControlSchemeInputAction.Accelerate],
                                inputDirection: InputDirection.Positive
                            };
                            inputsResult.inputs[ControlSchemeInputAction.Backwards] = {
                                ...b.inputs[ControlSchemeInputAction.Accelerate],
                                inputDirection: InputDirection.Negative
                            };
                            break;
                    }
                    return inputsResult;
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
