import { PortCommandTask } from '../../types';

export interface ITaskSpecificQueueCompressor {
    compress(queue: PortCommandTask[]): PortCommandTask[];
}
