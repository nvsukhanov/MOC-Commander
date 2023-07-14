import { PortCommandTask } from './port-command-task';

export type PortTasksModel = {
    hubId: string;
    portId: number;
    queue: PortCommandTask[];
    runningTask: PortCommandTask | null;
    lastExecutedTask: PortCommandTask | null;
};
