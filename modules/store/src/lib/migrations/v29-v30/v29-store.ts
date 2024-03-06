import { EntityState } from '@ngrx/entity';
import { ControlSchemeBindingType, ExtractArrayType, ExtractEntitiesType, Override } from '@app/shared-misc';

import { ControlSchemeInput } from '../../models';
import { AppStoreVersion } from '../../app-store-version';
import { V30Store } from '../v30';
import { OldInputAction } from '../old-input-actions';

export type V30ControlSchemesEntitiesState = ExtractEntitiesType<V30Store['controlSchemes']>;
export type V30Binding = ExtractArrayType<V30ControlSchemesEntitiesState['bindings']>;
export type V30SpeedBinding = V30Binding & { bindingType: ControlSchemeBindingType.Speed };
export type V30ServoBinding = V30Binding & { bindingType: ControlSchemeBindingType.Servo };
export type V30StepperBinding = V30Binding & { bindingType: ControlSchemeBindingType.Stepper };
export type V30TrainControlBinding = V30Binding & { bindingType: ControlSchemeBindingType.TrainControl };
export type V30GearboxBinding = V30Binding & { bindingType: ControlSchemeBindingType.Gearbox };
export type V30SetAngleBinding = V30Binding & { bindingType: ControlSchemeBindingType.SetAngle };

export type V29SpeedBinding = Override<V30SpeedBinding, {
    inputs: {
        [OldInputAction.Accelerate]: ControlSchemeInput;
        [OldInputAction.Brake]?: ControlSchemeInput;
    };
}>;

export type V29ServoBinding = Override<V30ServoBinding, {
    inputs: {
        [OldInputAction.ServoCw]?: ControlSchemeInput;
        [OldInputAction.ServoCcw]?: ControlSchemeInput;
    };
}>;

export type V29SetAngleBinding = Override<V30SetAngleBinding, {
    inputs: {
        [OldInputAction.SetAngle]: ControlSchemeInput;
    };
}>;

export type V29StepperBinding = Override<V30StepperBinding, {
    inputs: {
        [OldInputAction.Step]: ControlSchemeInput;
    };
}>;

export type V29TrainControlBinding = Override<V30TrainControlBinding, {
    inputs: {
        [OldInputAction.NextLevel]: ControlSchemeInput;
        [OldInputAction.PrevLevel]?: ControlSchemeInput;
        [OldInputAction.Reset]?: ControlSchemeInput;
    };
}>;

export type V29GearboxBinding = Override<V30GearboxBinding, {
    inputs: {
        [OldInputAction.NextLevel]: ControlSchemeInput;
        [OldInputAction.PrevLevel]?: ControlSchemeInput;
        [OldInputAction.Reset]?: ControlSchemeInput;
    };
}>;

export type V29Bindings = V29SpeedBinding
    | V29ServoBinding
    | V29StepperBinding
    | V29TrainControlBinding
    | V29GearboxBinding
    | V29SetAngleBinding;
export type V29ControlSchemesEntitiesState = Omit<V30ControlSchemesEntitiesState, 'bindings'> & { bindings: V29Bindings[] };

export type V29Store = Override<V30Store, {
    controlSchemes: Omit<V30Store['controlSchemes'], 'entities'> & EntityState<V29ControlSchemesEntitiesState>;
    storeVersion: AppStoreVersion.v29;
}>;
