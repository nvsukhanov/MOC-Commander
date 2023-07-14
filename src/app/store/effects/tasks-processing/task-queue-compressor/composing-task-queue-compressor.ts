import { ITaskQueueCompressor } from '../i-task-queue-compressor';
import { PortCommandTask } from '../../../models';

export class ComposingTaskQueueCompressor implements ITaskQueueCompressor {
    constructor(
        private readonly specificCompressors: readonly ITaskQueueCompressor[],
    ) {
    }

    public compress(
        queue: readonly PortCommandTask[]
    ): PortCommandTask[] {
        return this.specificCompressors.reduce((acc, val) => {
            return val.compress(acc);
        }, [ ...queue ]);
    }
}
