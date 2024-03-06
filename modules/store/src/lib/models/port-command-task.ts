import { MotorServoEndState } from 'rxpoweredup';
import { ControlSchemeBindingType } from '@app/shared-misc';

import { StepperInputAction } from './control-scheme.model';

export type SpeedTaskPayload = {
    bindingType: ControlSchemeBindingType.Speed;
    speed: number;
    brakeFactor: number; // [0 to MOTOR_LIMITS.MAX_SPEED]
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
    action: StepperInputAction;
};

export type TrainTaskPayload = {
    bindingType: ControlSchemeBindingType.Train;
    speed: number;
    power: number;
    initialLevelIndex: number;
    speedIndex: number;
    isLooping: boolean;
    useAccelerationProfile: boolean;
    useDecelerationProfile: boolean;
};

export type GearboxTaskPayload = {
    bindingType: ControlSchemeBindingType.Gearbox;
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

export type PortCommandTaskPayload = SpeedTaskPayload
    | ServoTaskPayload
    | SetAngleTaskPayload
    | StepperTaskPayload
    | TrainTaskPayload
    | GearboxTaskPayload;

export type PortCommandTask<TPayloadType extends ControlSchemeBindingType = ControlSchemeBindingType> = {
    hubId: string;
    portId: number;
    payload: PortCommandTaskPayload & { bindingType: TPayloadType };
    hash: string;
    inputTimestamp: number;
};
