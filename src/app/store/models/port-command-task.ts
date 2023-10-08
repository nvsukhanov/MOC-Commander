import { MotorServoEndState } from 'rxpoweredup';
import { ControlSchemeBindingType } from '@app/shared';

export type SetSpeedTaskPayload = {
    bindingType: ControlSchemeBindingType.SetSpeed;
    speed: number;
    brakeFactor: number; // 0 - MOTOR_LIMITS.MAX_SPEED
    power: number;
    useAccelerationProfile: boolean;
    useDecelerationProfile: boolean;
};

export type ServoTaskPayload = {
    bindingType: ControlSchemeBindingType.Servo;
    angle: number;
    speed: number;
    power: number;
    endState: MotorServoEndState;
    useAccelerationProfile: boolean;
    useDecelerationProfile: boolean;
};

export type SetAngleTaskPayload = {
    bindingType: ControlSchemeBindingType.SetAngle;
    angle: number;
    speed: number;
    power: number;
    endState: MotorServoEndState;
    useAccelerationProfile: boolean;
    useDecelerationProfile: boolean;
};

export type StepperTaskPayload = {
    bindingType: ControlSchemeBindingType.Stepper;
    degree: number;
    speed: number;
    power: number;
    endState: MotorServoEndState;
    useAccelerationProfile: boolean;
    useDecelerationProfile: boolean;
};

export type TrainControlTaskPayload = {
    bindingType: ControlSchemeBindingType.TrainControl;
    speed: number;
    power: number;
    initialLevelIndex: number;
    speedIndex: number;
    isLooping: boolean;
    useAccelerationProfile: boolean;
    useDecelerationProfile: boolean;
};

export type GearboxControlTaskPayload = {
    bindingType: ControlSchemeBindingType.GearboxControl;
    offset: number;
    angle: number;
    initialLevelIndex: number;
    power: number;
    speed: number;
    angleIndex: number;
    isLooping: boolean;
    endState: MotorServoEndState;
    useAccelerationProfile: boolean;
    useDecelerationProfile: boolean;
};

export type PortCommandTaskPayload = SetSpeedTaskPayload
    | ServoTaskPayload
    | SetAngleTaskPayload
    | StepperTaskPayload
    | TrainControlTaskPayload
    | GearboxControlTaskPayload;

export type PortCommandTask<TPayloadType extends ControlSchemeBindingType = ControlSchemeBindingType> = {
    hubId: string;
    portId: number;
    payload: PortCommandTaskPayload & { bindingType: TPayloadType };
    hash: string;
    inputTimestamp: number;
};
