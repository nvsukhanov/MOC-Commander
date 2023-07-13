import { PortCommandTask } from '@app/shared';

export type PortTasksModel = {
    hubId: string;
    portId: number;
    queue: PortCommandTask[];
    runningTask: PortCommandTask | null;
    lastExecutedTask: PortCommandTask | null;
}
