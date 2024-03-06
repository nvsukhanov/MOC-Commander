import { EntityState } from '@ngrx/entity';
import { ControlSchemeBindingType, ExtractArrayType, ExtractEntitiesType, Override } from '@app/shared-misc';

import { ControlSchemeInput } from '../../models';
import { AppStoreVersion } from '../../app-store-version';
import { V26Store } from '../v26-v27/v26-store';
import { OldInputAction } from '../old-input-actions';

export type V26ControlSchemesEntitiesState = ExtractEntitiesType<V26Store['controlSchemes']>;
export type V25ControlSchemeInput = Omit<ControlSchemeInput, 'inputDirection'>;
export type V26Bindings = ExtractArrayType<V26ControlSchemesEntitiesState['bindings']>;
export type V26SpeedBinding = V26Bindings & { bindingType: ControlSchemeBindingType.Speed };
export type V26ServoBinding = V26Bindings & { bindingType: ControlSchemeBindingType.Servo };
export type V26StepperBinding = V26Bindings & { bindingType: ControlSchemeBindingType.Stepper };
export type V26TrainBinding = V26Bindings & { bindingType: ControlSchemeBindingType.Train };
export type V26GearboxBinding = V26Bindings & { bindingType: ControlSchemeBindingType.Gearbox };
export type V26SetAngleBinding = V26Bindings & { bindingType: ControlSchemeBindingType.SetAngle };
export type V25SpeedBinding = Override<V26SpeedBinding, {
    inputs: {
        [OldInputAction.Accelerate]: V25ControlSchemeInput; // old ControlSchemeInputAction.Accelerate
        [OldInputAction.Brake]?: V25ControlSchemeInput; // old ControlSchemeInputAction.Brake
    };
}>;
export type V25ServoBinding = Override<V26ServoBinding, {
    inputs: {
        [OldInputAction.Servo]: V25ControlSchemeInput;
    };
}>;
export type V25StepperBinding = Override<V26StepperBinding, {
    inputs: {
        [OldInputAction.Step]: V25ControlSchemeInput;
    };
}>;
export type V25TrainBinding = Override<V26TrainBinding, {
    inputs: {
        [OldInputAction.NextLevel]: V25ControlSchemeInput;
        [OldInputAction.PrevLevel]?: V25ControlSchemeInput;
        [OldInputAction.Reset]?: V25ControlSchemeInput;
    };
}>;
export type V25GearboxBinding = Override<V26GearboxBinding, {
    inputs: {
        [OldInputAction.NextLevel]: V25ControlSchemeInput;
        [OldInputAction.PrevLevel]?: V25ControlSchemeInput;
        [OldInputAction.Reset]?: V25ControlSchemeInput;
    };
}>;
export type V25SetAngleBinding = Override<V26SetAngleBinding, {
    inputs: {
        [OldInputAction.SetAngle]: V25ControlSchemeInput;
    };
}>;
export type V25Bindings = V25SpeedBinding | V25ServoBinding | V25StepperBinding | V25TrainBinding | V25GearboxBinding | V25SetAngleBinding;
export type V25ControlSchemesEntitiesState = Omit<V26ControlSchemesEntitiesState, 'bindings'> & { bindings: V25Bindings[] };

export type V25Store = Override<V26Store, {
    controlSchemes: Omit<V26Store['controlSchemes'], 'entities'> & EntityState<V25ControlSchemesEntitiesState>;
    storeVersion: AppStoreVersion.v25;
}>;

