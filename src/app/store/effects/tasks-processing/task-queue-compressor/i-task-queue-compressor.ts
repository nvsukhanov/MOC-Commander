import { PortCommandTask } from '../../../models';

export interface ITaskQueueCompressor {
    compress(queue: PortCommandTask[]): PortCommandTask[];
}
