import { MotorServoEndState } from '@nvsukhanov/rxpoweredup';
import { ControllerInputType, HubIoOperationMode } from '@app/shared';

export type ControlSchemePortConfig = {
    hubId: string;
    portId: number;
    accelerationTimeMs: number;
    decelerationTimeMs: number;
};

export type AccelerationProfileMixin = {
    useAccelerationProfile: boolean;
};

export type DecelerationProfileMixin = {
    useDecelerationProfile: boolean;
};

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
} & AccelerationProfileMixin & DecelerationProfileMixin;

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
} & AccelerationProfileMixin & DecelerationProfileMixin;

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
} & AccelerationProfileMixin & DecelerationProfileMixin;

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
} & AccelerationProfileMixin & DecelerationProfileMixin;

export type ControlSchemeBinding = ControlSchemeLinearBinding
    | ControlSchemeServoBinding
    | ControlSchemeSetAngleBinding
    | ControlSchemeStepperBinding;

export type ControlSchemeModel = {
    id: string;
    name: string;
    portConfigs: ControlSchemePortConfig[];
    bindings: ControlSchemeBinding[];
};
