import { ControllerInputType, HubIoOperationMode } from '@app/shared';
import { MotorServoEndState } from '@nvsukhanov/rxpoweredup';

export type ControlSchemeLinearBinding = {
    id: string;
    operationMode: HubIoOperationMode.Linear;
    controllerId: string;
    inputId: string;
    inputType: ControllerInputType;
    hubId: string;
    portId: number;
    maxSpeed: number;
    isToggle: boolean;
    invert: boolean;
    power: number;
};

export type ControlSchemeServoBinding = {
    id: string;
    operationMode: HubIoOperationMode.Servo;
    controllerId: string;
    inputId: string;
    inputType: ControllerInputType;
    hubId: string;
    portId: number;
    range: number;
    aposCenter: number;
    speed: number;
    power: number;
    invert: boolean;
};

export type ControlSchemeSetAngleBinding = {
    id: string;
    operationMode: HubIoOperationMode.SetAngle;
    controllerId: string;
    inputId: string;
    inputType: ControllerInputType;
    hubId: string;
    portId: number;
    angle: number;
    speed: number;
    power: number;
    endState: MotorServoEndState;
};

export type ControlSchemeStepperBinding = {
    id: string;
    operationMode: HubIoOperationMode.Stepper;
    controllerId: string;
    inputId: string;
    inputType: ControllerInputType;
    hubId: string;
    portId: number;
    degree: number;
    speed: number;
    power: number;
    endState: MotorServoEndState;
};

export type ControlSchemeBinding = ControlSchemeLinearBinding
    | ControlSchemeServoBinding
    | ControlSchemeSetAngleBinding
    | ControlSchemeStepperBinding;

export type ControlSchemeModel = {
    id: string;
    name: string;
    bindings: ControlSchemeBinding[];
};
