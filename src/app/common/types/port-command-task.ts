export enum PortCommandTaskType {
    SetSpeed = 'SetSpeed',
}

export type PortCommandTask = PortCommandSetLinearSpeedTask;

export type PortCommandSetLinearSpeedTask = {
    taskType: PortCommandTaskType.SetSpeed,
    hubId: string,
    portId: number,
    bindingId: string,
    isNeutral: boolean,
    speed: number,
    createdAt: number,
}
