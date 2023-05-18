import { PortCommandTask } from '../../common';

export interface ITaskSpecificQueueCompressor {
    compress(queue: PortCommandTask[]): PortCommandTask[];
}
