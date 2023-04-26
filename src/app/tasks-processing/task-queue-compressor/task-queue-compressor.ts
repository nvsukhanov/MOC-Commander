import { ITaskSpecificQueueCompressor } from './i-task-specific-queue-compressor';
import { PortCommandTask } from '../../common';

export class TaskQueueCompressor {
    constructor(
        private readonly specificCompressors: readonly ITaskSpecificQueueCompressor[],
    ) {
    }

    public compress(queue: readonly PortCommandTask[]): PortCommandTask[] {
        return this.specificCompressors.reduce((acc, val) => {
            return val.compress(acc);
        }, [ ...queue ]);
    }
}
