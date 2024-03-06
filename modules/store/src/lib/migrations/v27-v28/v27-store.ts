import { EntityState } from '@ngrx/entity';
import { ControlSchemeBindingType, ExtractArrayType, ExtractEntitiesType, Override } from '@app/shared-misc';

import { V28Store } from '../v28-v29/v28-store';
import { ControlSchemeInput } from '../../models';
import { AppStoreVersion } from '../../app-store-version';
import { OldInputAction } from '../old-input-actions';

export type V28ControlSchemesEntitiesState = ExtractEntitiesType<V28Store['controlSchemes']>;
export type V28Binding = ExtractArrayType<V28ControlSchemesEntitiesState['bindings']>;
export type V28SpeedBinding = V28Binding & { bindingType: ControlSchemeBindingType.Speed };
export type V28ServoBinding = V28Binding & { bindingType: ControlSchemeBindingType.Servo };
export type V28StepperBinding = V28Binding & { bindingType: ControlSchemeBindingType.Stepper };
export type V28TrainBinding = V28Binding & { bindingType: ControlSchemeBindingType.Train };
export type V28GearboxBinding = V28Binding & { bindingType: ControlSchemeBindingType.Gearbox };
export type V28SetAngleBinding = V28Binding & { bindingType: ControlSchemeBindingType.SetAngle };

export type V27ServoBinding = Override<V28ServoBinding, {
    inputs: {
        [OldInputAction.Servo]: ControlSchemeInput;
    };
    invert: boolean;
}>;

export type V27Bindings = V28SpeedBinding
    | V27ServoBinding
    | V28StepperBinding
    | V28TrainBinding
    | V28GearboxBinding
    | V28SetAngleBinding;
export type V27ControlSchemesEntitiesState = Omit<V28ControlSchemesEntitiesState, 'bindings'> & { bindings: V27Bindings[] };

export type V27Store = Override<V28Store, {
    controlSchemes: Omit<V28Store['controlSchemes'], 'entities'> & EntityState<V27ControlSchemesEntitiesState>;
    storeVersion: AppStoreVersion.v27;
}>;
