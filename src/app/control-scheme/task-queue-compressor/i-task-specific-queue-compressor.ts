import { PortCommandTask } from '../task-composer';

export interface ITaskSpecificQueueCompressor {
    compress(queue: PortCommandTask[]): PortCommandTask[];
}
