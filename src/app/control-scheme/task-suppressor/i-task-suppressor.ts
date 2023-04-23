import { PortCommandTask } from '../task-composer';

export interface ITaskSuppressor {
    shouldSuppressTask<T extends PortCommandTask>(task: T, lastTaskOfKindInQueue: T): boolean;
}
