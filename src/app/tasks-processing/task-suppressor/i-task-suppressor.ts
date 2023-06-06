import { PortCommandTask } from '@app/shared';

export interface ITaskSuppressor {
    shouldSuppressTask<T extends PortCommandTask>(task: T, lastTaskOfKindInQueue?: T): boolean;
}
