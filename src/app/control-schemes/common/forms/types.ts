import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { ButtonGroupButtonId, MotorServoEndState } from 'rxpoweredup';
import { ControlSchemeBindingType, ControllerInputType } from '@app/shared-misc';
import { ControlSchemeInputAction, InputGain, LoopingMode } from '@app/store';

export type InputFormGroup = FormGroup<{
    controllerId: FormControl<string>;
    inputId: FormControl<string>;
    inputType: FormControl<ControllerInputType>;
    gain: FormControl<InputGain>;
    buttonId: FormControl<ButtonGroupButtonId | null>;
    portId: FormControl<number | null>;
}>;

export type OptionalInputFormGroup = FormGroup<{
    controllerId: FormControl<string | null>;
    inputId: FormControl<string>;
    inputType: FormControl<ControllerInputType>;
    gain: FormControl<InputGain>;
    buttonId: FormControl<ButtonGroupButtonId | null>;
    portId: FormControl<number | null>;
}>;

export type SetSpeedBindingForm = FormGroup<{
    inputs: FormGroup<{
        [ControlSchemeInputAction.Accelerate]: InputFormGroup;
        [ControlSchemeInputAction.Brake]: OptionalInputFormGroup;
    }>;
    hubId: FormControl<string | null>;
    portId: FormControl<number | null>;
    maxSpeed: FormControl<number>;
    invert: FormControl<boolean>;
    power: FormControl<number>;
    useAccelerationProfile: FormControl<boolean>;
    useDecelerationProfile: FormControl<boolean>;
}>;

export type ServoBindingForm = FormGroup<{
    inputs: FormGroup<{
        [ControlSchemeInputAction.Servo]: InputFormGroup;
    }>;
    hubId: FormControl<string | null>;
    portId: FormControl<number | null>;
    calibrateOnStart: FormControl<boolean>;
    range: FormControl<number>;
    aposCenter: FormControl<number>;
    speed: FormControl<number>;
    power: FormControl<number>;
    invert: FormControl<boolean>;
    useAccelerationProfile: FormControl<boolean>;
    useDecelerationProfile: FormControl<boolean>;
}>;

export type StepperBindingForm = FormGroup<{
    inputs: FormGroup<{
        [ControlSchemeInputAction.Step]: InputFormGroup;
    }>;
    hubId: FormControl<string | null>;
    portId: FormControl<number | null>;
    degree: FormControl<number>;
    speed: FormControl<number>;
    power: FormControl<number>;
    endState: FormControl<MotorServoEndState>;
    useAccelerationProfile: FormControl<boolean>;
    useDecelerationProfile: FormControl<boolean>;
}>;

export type SetAngleBindingForm = FormGroup<{
    inputs: FormGroup<{
        [ControlSchemeInputAction.SetAngle]: InputFormGroup;
    }>;
    hubId: FormControl<string | null>;
    portId: FormControl<number | null>;
    angle: FormControl<number>;
    speed: FormControl<number>;
    power: FormControl<number>;
    endState: FormControl<MotorServoEndState>;
    useAccelerationProfile: FormControl<boolean>;
    useDecelerationProfile: FormControl<boolean>;
}>;

export type TrainControlBindingForm = FormGroup<{
    inputs: FormGroup<{
        [ControlSchemeInputAction.NextLevel]: InputFormGroup;
        [ControlSchemeInputAction.PrevLevel]: OptionalInputFormGroup;
        [ControlSchemeInputAction.Reset]: OptionalInputFormGroup;
    }>;
    hubId: FormControl<string | null>;
    portId: FormControl<number | null>;
    levels: FormArray<FormControl<number>>;
    power: FormControl<number>;
    loopingMode: FormControl<LoopingMode>;
    useAccelerationProfile: FormControl<boolean>;
    useDecelerationProfile: FormControl<boolean>;
    initialLevelIndex: FormControl<number>;
}>;

export type GearboxControlBindingForm = FormGroup<{
    inputs: FormGroup<{
        [ControlSchemeInputAction.NextLevel]: InputFormGroup;
        [ControlSchemeInputAction.PrevLevel]: OptionalInputFormGroup;
        [ControlSchemeInputAction.Reset]: OptionalInputFormGroup;
    }>;
    hubId: FormControl<string | null>;
    portId: FormControl<number | null>;
    angles: FormArray<FormControl<number>>;
    power: FormControl<number>;
    speed: FormControl<number>;
    loopingMode: FormControl<LoopingMode>;
    endState: FormControl<MotorServoEndState>;
    useAccelerationProfile: FormControl<boolean>;
    useDecelerationProfile: FormControl<boolean>;
    initialLevelIndex: FormControl<number>;
}>;

export type ControlSchemeBindingForm = FormGroup<{
    id: FormControl<number>;
    bindingType: FormControl<ControlSchemeBindingType>;
    [ControlSchemeBindingType.SetSpeed]: SetSpeedBindingForm;
    [ControlSchemeBindingType.Servo]: ServoBindingForm;
    [ControlSchemeBindingType.Stepper]: StepperBindingForm;
    [ControlSchemeBindingType.SetAngle]: SetAngleBindingForm;
    [ControlSchemeBindingType.TrainControl]: TrainControlBindingForm;
    [ControlSchemeBindingType.GearboxControl]: GearboxControlBindingForm;
}>;

export type PortConfigEditForm = FormGroup<{
    hubId: FormControl<string | null>;
    portId: FormControl<number | null>;
    accelerationTimeMs: FormControl<number>;
    decelerationTimeMs: FormControl<number>;
}>;
