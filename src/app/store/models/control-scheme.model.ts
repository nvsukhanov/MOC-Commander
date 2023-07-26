import { ControllerInputType, HubIoOperationMode } from '@app/shared';
import { MotorServoEndState } from '@nvsukhanov/rxpoweredup';

export type ControlSchemeHubConfig = {
    hubId: string;
    useAccelerationProfile: boolean;
    accelerationTimeMs: number;
    useDecelerationProfile: boolean;
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
    hubConfigurations: ControlSchemeHubConfig[];
    bindings: ControlSchemeBinding[];
};
