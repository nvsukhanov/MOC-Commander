import { PortCommandTask } from '../../common';

export interface ITaskSuppressor {
    shouldSuppressTask<T extends PortCommandTask>(task: T, lastTaskOfKindInQueue?: T): boolean;
}
