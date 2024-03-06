import { Injectable } from '@angular/core';
import { MOTOR_LIMITS } from 'rxpoweredup';
import { ControllerInputType } from '@app/controller-profiles';
import { ControlSchemeBindingType, DeepPartial } from '@app/shared-misc';

import { AppStoreVersion } from '../../app-store-version';
import { IMigration } from '../i-migration';
import {
    GearboxControlInputAction,
    InputDirection,
    ServoInputAction,
    SetAngleInputAction,
    SpeedInputAction,
    StepperInputAction,
    TrainControlInputAction
} from '../../models';
import {
    V29ControlSchemesEntitiesState,
    V29GearboxControlBinding,
    V29ServoBinding,
    V29SetAngleBinding,
    V29SpeedBinding,
    V29StepperBinding,
    V29Store,
    V29TrainControlBinding,
    V30Binding,
    V30GearboxControlBinding,
    V30ServoBinding,
    V30SetAngleBinding,
    V30SpeedBinding,
    V30StepperBinding,
    V30TrainControlBinding
} from './v29-store';
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
                switch (b.bindingType) {
                    case ControlSchemeBindingType.Speed:
                        return this.migrateSpeed(b);
                    case ControlSchemeBindingType.Servo:
                        return this.migrateServo(b);
                    case ControlSchemeBindingType.SetAngle:
                        return this.migrateSetAngle(b);
                    case ControlSchemeBindingType.Stepper:
                        return this.migrateStepper(b);
                    case ControlSchemeBindingType.TrainControl:
                        return this.migrateTrain(b);
                    case ControlSchemeBindingType.GearboxControl:
                        return this.migrateGearbox(b);
                }
            });

            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            result.controlSchemes!.entities![k] = {
                ...controlScheme,
                bindings
            };
        });
        return result;
    }

    private migrateGearbox(
        b: V29GearboxControlBinding
    ): V30GearboxControlBinding {
        const bindingResult: V30GearboxControlBinding = {
            ...b,
            inputs: {
                [GearboxControlInputAction.NextGear]: {
                    ...b.inputs[OldInputAction.NextLevel]
                }
            }
        };
        if (b.inputs[OldInputAction.PrevLevel]) {
            bindingResult.inputs[GearboxControlInputAction.PrevGear] = {
                ...b.inputs[OldInputAction.PrevLevel]
            };
        }
        if (b.inputs[OldInputAction.Reset]) {
            bindingResult.inputs[GearboxControlInputAction.Reset] = {
                ...b.inputs[OldInputAction.Reset]
            };
        }
        return bindingResult;
    }

    private migrateTrain(
        b: V29TrainControlBinding
    ): V30TrainControlBinding {
        const bindingResult: V30TrainControlBinding = {
            ...b,
            inputs: {
                [TrainControlInputAction.NextSpeed]: {
                    ...b.inputs[OldInputAction.NextLevel]
                }
            }
        };
        if (b.inputs[OldInputAction.PrevLevel]) {
            bindingResult.inputs[TrainControlInputAction.PrevSpeed] = {
                ...b.inputs[OldInputAction.PrevLevel]
            };
        }
        if (b.inputs[OldInputAction.Reset]) {
            bindingResult.inputs[TrainControlInputAction.Reset] = {
                ...b.inputs[OldInputAction.Reset]
            };
        }
        return bindingResult;
    }

    private migrateSetAngle(
        b: V29SetAngleBinding
    ): V30SetAngleBinding {
        return {
            ...b,
            inputs: {
                [SetAngleInputAction.SetAngle]: {
                    ...b.inputs[OldInputAction.SetAngle]
                }
            }
        };
    }

    private migrateServo(
        b: V29ServoBinding
    ): V30ServoBinding {
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

    private migrateSpeed(
        v29binding: V29SpeedBinding
    ): V30SpeedBinding {
        const bindingResult: V30SpeedBinding = {
            ...v29binding,
            inputs:{}
        };
        if (v29binding.inputs[OldInputAction.Brake]) {
            bindingResult.inputs[SpeedInputAction.Brake] = {
                ...v29binding.inputs[OldInputAction.Brake]
            };
        }
        switch (v29binding.inputs[OldInputAction.Accelerate].inputType) {
            case ControllerInputType.Button:
            case ControllerInputType.ButtonGroup:
            case ControllerInputType.Trigger:
                bindingResult.inputs[SpeedInputAction.Forwards] = {
                    ...v29binding.inputs[OldInputAction.Accelerate]
                };
                break;
            case ControllerInputType.Axis:
                bindingResult.inputs[SpeedInputAction.Forwards] = {
                    ...v29binding.inputs[OldInputAction.Accelerate],
                    inputDirection: InputDirection.Positive
                };
                bindingResult.inputs[SpeedInputAction.Backwards] = {
                    ...v29binding.inputs[0], // old ControlSchemeInputAction.Accelerate
                    inputDirection: InputDirection.Negative
                };
                break;
        }
        return bindingResult;
    }

    private migrateStepper(
        v29Binding: V29StepperBinding
    ): V30StepperBinding {
        const bindingResult: V30StepperBinding = {
            ...v29Binding,
            inputs: {}
        };
        const prevInputs = v29Binding.inputs[OldInputAction.Step];
        if (prevInputs.inputType === ControllerInputType.Axis) {
            if (v29Binding.degree >= 0) {
                bindingResult.inputs[StepperInputAction.Cw] = {
                    ...prevInputs,
                    inputDirection: InputDirection.Positive
                };
                bindingResult.inputs[StepperInputAction.Ccw] = {
                    ...prevInputs,
                    inputDirection: InputDirection.Negative
                };
            } else {
                bindingResult.inputs[StepperInputAction.Cw] = {
                    ...prevInputs,
                    inputDirection: InputDirection.Negative
                };
                bindingResult.inputs[StepperInputAction.Ccw] = {
                    ...prevInputs,
                    inputDirection: InputDirection.Positive
                };
            }
        } else {
            if (v29Binding.degree >= 0) {
                bindingResult.inputs[StepperInputAction.Cw] = {
                    ...prevInputs
                };
            } else {
                bindingResult.inputs[StepperInputAction.Ccw] = {
                    ...prevInputs
                };

            }
        }
        bindingResult.degree = Math.max(Math.abs(v29Binding.degree), MOTOR_LIMITS.minServoDegreesRange);
        return bindingResult;
    }
}
