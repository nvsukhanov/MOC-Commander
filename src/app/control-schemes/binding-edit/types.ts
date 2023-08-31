import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { ButtonGroupButtonId, MotorServoEndState } from 'rxpoweredup';
import { ControlSchemeInputAction, InputGain } from '@app/store';
import { ControlSchemeBindingType, ControllerInputType } from '@app/shared';

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
    id: FormControl<string>;
    inputs: FormGroup<{
        [ControlSchemeInputAction.Accelerate]: InputFormGroup;
        [ControlSchemeInputAction.Brake]: OptionalInputFormGroup;
    }>;
    hubId: FormControl<string>;
    portId: FormControl<number>;
    maxSpeed: FormControl<number>;
    isToggle: FormControl<boolean>;
    invert: FormControl<boolean>;
    power: FormControl<number>;
    useAccelerationProfile: FormControl<boolean>;
    useDecelerationProfile: FormControl<boolean>;
}>;

export type ServoBindingForm = FormGroup<{
    id: FormControl<string>;
    inputs: FormGroup<{
        [ControlSchemeInputAction.Servo]: InputFormGroup;
    }>;
    hubId: FormControl<string>;
    portId: FormControl<number>;
    range: FormControl<number>;
    aposCenter: FormControl<number>;
    speed: FormControl<number>;
    power: FormControl<number>;
    invert: FormControl<boolean>;
    useAccelerationProfile: FormControl<boolean>;
    useDecelerationProfile: FormControl<boolean>;
}>;

export type StepperBindingForm = FormGroup<{
    id: FormControl<string>;
    inputs: FormGroup<{
        [ControlSchemeInputAction.Step]: InputFormGroup;
    }>;
    hubId: FormControl<string>;
    portId: FormControl<number>;
    degree: FormControl<number>;
    speed: FormControl<number>;
    power: FormControl<number>;
    endState: FormControl<MotorServoEndState>;
    useAccelerationProfile: FormControl<boolean>;
    useDecelerationProfile: FormControl<boolean>;
}>;

export type SetAngleBindingForm = FormGroup<{
    id: FormControl<string>;
    inputs: FormGroup<{
        [ControlSchemeInputAction.SetAngle]: InputFormGroup;
    }>;
    hubId: FormControl<string>;
    portId: FormControl<number>;
    angle: FormControl<number>;
    speed: FormControl<number>;
    power: FormControl<number>;
    endState: FormControl<MotorServoEndState>;
    useAccelerationProfile: FormControl<boolean>;
    useDecelerationProfile: FormControl<boolean>;
}>;

export type SpeedShiftBindingForm = FormGroup<{
    id: FormControl<string>;
    inputs: FormGroup<{
        [ControlSchemeInputAction.NextLevel]: InputFormGroup;
        [ControlSchemeInputAction.PrevLevel]: OptionalInputFormGroup;
        [ControlSchemeInputAction.Reset]: OptionalInputFormGroup;
    }>;
    hubId: FormControl<string>;
    portId: FormControl<number>;
    levels: FormArray<FormControl<number>>;
    power: FormControl<number>;
    useAccelerationProfile: FormControl<boolean>;
    useDecelerationProfile: FormControl<boolean>;
    initialStepIndex: FormControl<number>;
}>;

export type AngleShiftBindingForm = FormGroup<{
    id: FormControl<string>;
    inputs: FormGroup<{
        [ControlSchemeInputAction.NextLevel]: InputFormGroup;
        [ControlSchemeInputAction.PrevLevel]: OptionalInputFormGroup;
    }>;
    hubId: FormControl<string>;
    portId: FormControl<number>;
    angles: FormArray<FormControl<number>>;
    power: FormControl<number>;
    speed: FormControl<number>;
    endState: FormControl<MotorServoEndState>;
    useAccelerationProfile: FormControl<boolean>;
    useDecelerationProfile: FormControl<boolean>;
    initialStepIndex: FormControl<number>;
}>;

export type ControlSchemeBindingForm = FormGroup<{
    bindingType: FormControl<ControlSchemeBindingType>;
    [ControlSchemeBindingType.SetSpeed]: SetSpeedBindingForm;
    [ControlSchemeBindingType.Servo]: ServoBindingForm;
    [ControlSchemeBindingType.Stepper]: StepperBindingForm;
    [ControlSchemeBindingType.SetAngle]: SetAngleBindingForm;
    [ControlSchemeBindingType.SpeedShift]: SpeedShiftBindingForm;
    [ControlSchemeBindingType.AngleShift]: AngleShiftBindingForm;
}>;

export type HubWithConnectionState = {
    hubId: string;
    name: string;
    isConnected: boolean;
};
