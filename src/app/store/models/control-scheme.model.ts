import { MotorServoEndState } from '@nvsukhanov/rxpoweredup';

import { ControllerInputType, HubIoOperationMode } from '@app/shared';

export type ControlSchemeModel = {
    id: string;
    index: number;
    name: string;
    bindings: ControlSchemeBinding[];
}

export type ControlSchemeBindingInput = {
    controllerId: string;
    inputType: ControllerInputType;
    inputId: string;
}

export type ControlSchemeBinding = {
    id: string;
    input: ControlSchemeBindingInput;
    output: BindingOutputState;
}

export type BindingLinearOutputState = {
    hubId: string;
    portId: number;
    operationMode: HubIoOperationMode.Linear;
    linearConfig: {
        maxSpeed: number;
        isToggle: boolean;
        invert: boolean;
        power: number;
    }
}

export type BindingServoOutputState = {
    hubId: string;
    portId: number;
    operationMode: HubIoOperationMode.Servo;
    servoConfig: {
        range: number;
        aposCenter: number;
        speed: number;
        power: number;
        invert: boolean;
    }
}

export type BindingSetAngleOutputState = {
    hubId: string;
    portId: number;
    operationMode: HubIoOperationMode.SetAngle;
    setAngleConfig: {
        angle: number;
        speed: number;
        power: number;
        endState: MotorServoEndState;
    }
}

export type BindingStepperOutputState = {
    hubId: string;
    portId: number;
    operationMode: HubIoOperationMode.Stepper;
    stepperConfig: {
        degree: number;
        speed: number;
        power: number;
        endState: MotorServoEndState;
    }
}

export type BindingOutputState = BindingLinearOutputState
    | BindingServoOutputState
    | BindingSetAngleOutputState
    | BindingStepperOutputState;
