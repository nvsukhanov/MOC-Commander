import { MotorServoEndState } from '@nvsukhanov/rxpoweredup';

export enum PortCommandTaskType {
    SetSpeed = 'SetSpeed',
    Servo = 'Servo',
    SetAngle = 'SetAngle',
}

export type PortCommandSetLinearSpeedTask = {
    taskType: PortCommandTaskType.SetSpeed,
    hubId: string,
    portId: number,
    bindingId: string,
    isNeutral: boolean,
    speed: number,
    power: number,
    createdAt: number,
}

export type PortCommandServoTask = {
    taskType: PortCommandTaskType.Servo,
    hubId: string,
    portId: number,
    bindingId: string,
    isNeutral: boolean,
    angle: number,
    speed: number,
    power: number,
    endState: MotorServoEndState,
    createdAt: number,
}

export type PortCommandSetAngle = {
    taskType: PortCommandTaskType.SetAngle,
    hubId: string,
    portId: number,
    bindingId: string,
    isNeutral: boolean,
    angle: number,
    speed: number,
    power: number,
    endState: MotorServoEndState,
    createdAt: number
}

export type PortCommandTask = PortCommandSetLinearSpeedTask | PortCommandServoTask | PortCommandSetAngle;
