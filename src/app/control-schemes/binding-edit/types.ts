import { FormControl, FormGroup } from '@angular/forms';
import { ButtonGroupButtonId, MotorServoEndState } from '@nvsukhanov/rxpoweredup';
import { AttachedIoModel, InputGain } from '@app/store';
import { ControllerInputType, HubIoOperationMode } from '@app/shared';

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

export type ControlSchemeBindingForm = FormGroup<{
    bindingFormOperationMode: FormControl<HubIoOperationMode>;
    [HubIoOperationMode.Linear]: LinearBindingForm;
    [HubIoOperationMode.Servo]: ServoBindingForm;
    [HubIoOperationMode.Stepper]: StepperBindingForm;
    [HubIoOperationMode.SetAngle]: SetAngleBindingForm;
}>;

export type BindingEditAvailableOperationModesModel = {
    [operationMode in HubIoOperationMode]?: {
        hubs: Array<{ id: string; name: string }>;
        hubIos: {
            [hubId in string]: AttachedIoModel[]
        };
    }
};
