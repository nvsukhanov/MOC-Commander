import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { ButtonGroupButtonId, MotorServoEndState } from '@nvsukhanov/rxpoweredup';
import { AttachedIoModel, InputGain } from '@app/store';
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

export type LinearBindingForm = FormGroup<{
    id: FormControl<string>;
    inputs: FormGroup<{
        accelerate: InputFormGroup;
        brake: OptionalInputFormGroup;
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
        servo: InputFormGroup;
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
        step: InputFormGroup;
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
        setAngle: InputFormGroup;
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
        nextSpeed: InputFormGroup;
        prevSpeed: OptionalInputFormGroup;
        stop: OptionalInputFormGroup;
    }>;
    hubId: FormControl<string>;
    portId: FormControl<number>;
    levels: FormArray<FormControl<number>>;
    power: FormControl<number>;
    useAccelerationProfile: FormControl<boolean>;
    useDecelerationProfile: FormControl<boolean>;
    initialStepIndex: FormControl<number>;
}>;

export type ControlSchemeBindingForm = FormGroup<{
    bindingFormOperationMode: FormControl<ControlSchemeBindingType>;
    [ControlSchemeBindingType.Linear]: LinearBindingForm;
    [ControlSchemeBindingType.Servo]: ServoBindingForm;
    [ControlSchemeBindingType.Stepper]: StepperBindingForm;
    [ControlSchemeBindingType.SetAngle]: SetAngleBindingForm;
    [ControlSchemeBindingType.SpeedShift]: SpeedShiftBindingForm;
}>;

export type BindingEditAvailableOperationModesModel = {
    [operationMode in ControlSchemeBindingType]?: {
        hubs: Array<{ id: string; name: string }>;
        hubIos: {
            [hubId in string]: AttachedIoModel[]
        };
    }
};
