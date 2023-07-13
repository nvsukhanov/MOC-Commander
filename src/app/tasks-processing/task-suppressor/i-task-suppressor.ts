import { PortCommandTask } from '@app/shared';

export interface ITaskSuppressor {
    shouldSuppressTask<T extends PortCommandTask>(
        nextTask: T,
        lastTaskOfKindInQueue: T | null
    ): boolean;
}
