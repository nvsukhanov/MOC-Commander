import { PortCommandTask } from '../../types';

export interface ITaskSuppressor {
    shouldSuppressTask<T extends PortCommandTask>(task: T, lastTaskOfKindInQueue: T): boolean;
}
