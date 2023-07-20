import { ControllerInputType, HubIoOperationMode } from '@app/shared';
import { MotorServoEndState } from '@nvsukhanov/rxpoweredup';

export type ControlSchemeV2LinearBinding = {
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

export type ControlSchemeV2ServoBinding = {
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

export type ControlSchemeV2SetAngleBinding = {
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

export type ControlSchemeV2StepperBinding = {
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

export type ControlSchemeV2Binding = ControlSchemeV2LinearBinding
    | ControlSchemeV2ServoBinding
    | ControlSchemeV2SetAngleBinding
    | ControlSchemeV2StepperBinding;

export type ControlSchemeV2Model = {
    id: string;
    name: string;
    bindings: ControlSchemeV2Binding[];
};
