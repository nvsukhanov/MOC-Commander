import { EntityState } from '@ngrx/entity';
import { ControlSchemeBindingType, ExtractArrayType, ExtractEntitiesType, Override } from '@app/shared-misc';

import { V28Store } from './v28-store';
import { ControlSchemeInput, ControlSchemeInputAction } from '../models';
import { AppStoreVersion } from '../app-store-version';

export type V28ControlSchemesEntitiesState = ExtractEntitiesType<V28Store['controlSchemes']>;
export type V28Binding = ExtractArrayType<V28ControlSchemesEntitiesState['bindings']>;
export type V28SetSpeedBinding = V28Binding & { bindingType: ControlSchemeBindingType.SetSpeed };
export type V28ServoBinding = V28Binding & { bindingType: ControlSchemeBindingType.Servo };
export type V28StepperBinding = V28Binding & { bindingType: ControlSchemeBindingType.Stepper };
export type V28TrainControlBinding = V28Binding & { bindingType: ControlSchemeBindingType.TrainControl };
export type V28GearboxControlBinding = V28Binding & { bindingType: ControlSchemeBindingType.GearboxControl };
export type V28SetAngleBinding = V28Binding & { bindingType: ControlSchemeBindingType.SetAngle };

export type V27ServoBinding = Override<V28ServoBinding, {
    inputs: {
        [ControlSchemeInputAction.Servo]: ControlSchemeInput;
    };
    invert: boolean;
}>;

export type V27Bindings = V28SetSpeedBinding
    | V27ServoBinding
    | V28StepperBinding
    | V28TrainControlBinding
    | V28GearboxControlBinding
    | V28SetAngleBinding;
export type V27ControlSchemesEntitiesState = Omit<V28ControlSchemesEntitiesState, 'bindings'> & { bindings: V27Bindings[] };

export type V27Store = Override<V28Store, {
    controlSchemes: Omit<V28Store['controlSchemes'], 'entities'> & EntityState<V27ControlSchemesEntitiesState>;
    storeVersion: AppStoreVersion.v27;
}>;
