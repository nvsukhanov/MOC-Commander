import { PortCommandTask } from '@app/shared';

export interface ITaskQueueCompressor {
    compress(queue: PortCommandTask[]): PortCommandTask[];
}
