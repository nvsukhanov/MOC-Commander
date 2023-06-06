import { PortCommandTask } from '@app/shared';

export interface ITaskSpecificQueueCompressor {
    compress(queue: PortCommandTask[]): PortCommandTask[];
}
