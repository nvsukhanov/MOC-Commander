export enum PortCommandTaskType {
    SetSpeed = 'SetSpeed',
}

export type PortCommandTask = PortCommandSetLinearSpeedTask;

export type PortCommandSetLinearSpeedTask = {
    taskType: PortCommandTaskType.SetSpeed,
    hubId: string,
    portId: number,
    speed: number,
    createdAt: number,
}
