import { MotorServoEndState } from '@nvsukhanov/rxpoweredup';

export enum PortCommandTaskType {
    SetSpeed = 'SetSpeed',
    Servo = 'Servo',
    SetAngle = 'SetAngle',
    Stepper = 'Stepper',
}

export type SetLinearSpeedTaskPayload = {
    taskType: PortCommandTaskType.SetSpeed;
    activeInput: boolean;
    speed: number;
    power: number;
    useAccelerationProfile: boolean;
    useDecelerationProfile: boolean;
};

export type ServoTaskPayload = {
    taskType: PortCommandTaskType.Servo;
    angle: number;
    speed: number;
    power: number;
    endState: MotorServoEndState;
    useAccelerationProfile: boolean;
    useDecelerationProfile: boolean;
};

export type SetAngleTaskPayload = {
    taskType: PortCommandTaskType.SetAngle;
    angle: number;
    speed: number;
    power: number;
    endState: MotorServoEndState;
    useAccelerationProfile: boolean;
    useDecelerationProfile: boolean;
};

export type StepperTaskPayload = {
    taskType: PortCommandTaskType.Stepper;
    degree: number;
    speed: number;
    power: number;
    endState: MotorServoEndState;
    useAccelerationProfile: boolean;
    useDecelerationProfile: boolean;
};

export type PortCommandTaskPayload = SetLinearSpeedTaskPayload
    | ServoTaskPayload
    | SetAngleTaskPayload
    | StepperTaskPayload;

export type PortCommandTask<TPayloadType extends PortCommandTaskType = PortCommandTaskType> = {
    hubId: string;
    portId: number;
    bindingId: string;
    payload: PortCommandTaskPayload & { taskType: TPayloadType };
    hash: string;
};
