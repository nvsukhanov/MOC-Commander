import { MotorServoEndState } from '@nvsukhanov/rxpoweredup';

export enum PortCommandTaskType {
    SetSpeed = 'SetSpeed',
    Servo = 'Servo',
    SetAngle = 'SetAngle',
    Stepper = 'Stepper',
}

export type SetLinearSpeedTaskPayload = {
    taskType: PortCommandTaskType.SetSpeed,
    activeInput: boolean,
    speed: number,
    power: number,
};

export type ServoTaskPayload = {
    taskType: PortCommandTaskType.Servo,
    angle: number,
    speed: number,
    power: number,
    endState: MotorServoEndState,
};

export type SetAngleTaskPayload = {
    taskType: PortCommandTaskType.SetAngle,
    angle: number,
    speed: number,
    power: number,
    endState: MotorServoEndState,
};

export type StepperTaskPayload = {
    taskType: PortCommandTaskType.Stepper,
    degree: number,
    speed: number,
    power: number,
    endState: MotorServoEndState,
};

export type PortCommandTaskPayload = SetLinearSpeedTaskPayload
    | ServoTaskPayload
    | SetAngleTaskPayload
    | StepperTaskPayload;

export type PortCommandTask = {
    hubId: string,
    portId: number,
    bindingId: string,
    payload: PortCommandTaskPayload,
    hash: string
}
