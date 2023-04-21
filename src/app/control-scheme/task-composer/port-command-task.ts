export enum PortCommandTaskType {
    SetSpeed = 'SetSpeed',
}

export type PortCommandTask = PortCommandSetLinearSpeedTask;

export type PortCommandSetLinearSpeedTask = {
    taskType: PortCommandTaskType.SetSpeed,
    portId: number,
    speed: number,
}
