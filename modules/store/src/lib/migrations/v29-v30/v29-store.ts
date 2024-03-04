import { EntityState } from '@ngrx/entity';
import { ControlSchemeBindingType, ExtractArrayType, ExtractEntitiesType, Override } from '@app/shared-misc';

import { ControlSchemeInput, ControlSchemeInputAction } from '../../models';
import { AppStoreVersion } from '../../app-store-version';
import { V30Store } from '../v30';

export type V30ControlSchemesEntitiesState = ExtractEntitiesType<V30Store['controlSchemes']>;
export type V30Binding = ExtractArrayType<V30ControlSchemesEntitiesState['bindings']>;
export type V30SetSpeedBinding = V30Binding & { bindingType: ControlSchemeBindingType.SetSpeed };
export type V30ServoBinding = V30Binding & { bindingType: ControlSchemeBindingType.Servo };
export type V30StepperBinding = V30Binding & { bindingType: ControlSchemeBindingType.Stepper };
export type V30TrainControlBinding = V30Binding & { bindingType: ControlSchemeBindingType.TrainControl };
export type V30GearboxControlBinding = V30Binding & { bindingType: ControlSchemeBindingType.GearboxControl };
export type V30SetAngleBinding = V30Binding & { bindingType: ControlSchemeBindingType.SetAngle };

export type V29SetSpeedBinding = Override<V30SetSpeedBinding, {
    inputs: {
        [ControlSchemeInputAction.Accelerate]: ControlSchemeInput;
        [ControlSchemeInputAction.OldSetSpeedBrake]?: ControlSchemeInput;
    };
    invert: boolean;
}>;

export type V29Bindings = V29SetSpeedBinding
    | V30ServoBinding
    | V30StepperBinding
    | V30TrainControlBinding
    | V30GearboxControlBinding
    | V30SetAngleBinding;
export type V29ControlSchemesEntitiesState = Omit<V30ControlSchemesEntitiesState, 'bindings'> & { bindings: V29Bindings[] };

export type V29Store = Override<V30Store, {
    controlSchemes: Omit<V30Store['controlSchemes'], 'entities'> & EntityState<V29ControlSchemesEntitiesState>;
    storeVersion: AppStoreVersion.v29;
}>;
