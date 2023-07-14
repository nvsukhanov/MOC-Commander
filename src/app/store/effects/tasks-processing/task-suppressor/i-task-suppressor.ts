import { PortCommandTask } from '../../../models';

export interface ITaskSuppressor {
    shouldSuppressTask<T extends PortCommandTask>(
        nextTask: T,
        lastTaskOfKindInQueue: T | null
    ): boolean;
}
