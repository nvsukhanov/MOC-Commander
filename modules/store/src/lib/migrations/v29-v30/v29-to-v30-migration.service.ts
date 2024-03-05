import { Injectable } from '@angular/core';
import { ControllerInputType } from '@app/controller-profiles';
import { ControlSchemeBindingType, DeepPartial } from '@app/shared-misc';

import { AppStoreVersion } from '../../app-store-version';
import { IMigration } from '../i-migration';
import { InputDirection, ServoInputAction, SetSpeedInputAction } from '../../models';
import { V29ControlSchemesEntitiesState, V29Store, V30Binding, V30ServoBinding, V30SetSpeedBinding } from './v29-store';
import { V30Store } from '../v30';
import { OldInputAction } from '../old-input-actions';

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
                    const bindingResult: V30SetSpeedBinding = {
                        ...b,
                        inputs:{}
                    };
                    if (b.inputs[OldInputAction.Brake]) {
                        bindingResult.inputs[SetSpeedInputAction.Brake] = {
                            ...b.inputs[OldInputAction.Brake]
                        };
                    }
                    switch (b.inputs[OldInputAction.Accelerate].inputType) {
                        case ControllerInputType.Button:
                        case ControllerInputType.ButtonGroup:
                        case ControllerInputType.Trigger:
                            bindingResult.inputs[SetSpeedInputAction.Forwards] = {
                                ...b.inputs[OldInputAction.Accelerate]
                            };
                            break;
                        case ControllerInputType.Axis:
                            bindingResult.inputs[SetSpeedInputAction.Forwards] = {
                                ...b.inputs[OldInputAction.Accelerate],
                                inputDirection: InputDirection.Positive
                            };
                            bindingResult.inputs[SetSpeedInputAction.Backwards] = {
                                ...b.inputs[0], // old ControlSchemeInputAction.Accelerate
                                inputDirection: InputDirection.Negative
                            };
                            break;
                    }
                    return bindingResult;
                } else if (b.bindingType === ControlSchemeBindingType.Servo) {
                    const bindingResult: V30ServoBinding = {
                        ...b,
                        inputs: {}
                    };
                    if (b.inputs[OldInputAction.ServoCw]) {
                        bindingResult.inputs[ServoInputAction.Cw] = {
                            ...b.inputs[OldInputAction.ServoCw]
                        };
                    }
                    if (b.inputs[OldInputAction.ServoCcw]) {
                        bindingResult.inputs[ServoInputAction.Ccw] = {
                            ...b.inputs[OldInputAction.ServoCcw]
                        };
                    }
                    return bindingResult;
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
