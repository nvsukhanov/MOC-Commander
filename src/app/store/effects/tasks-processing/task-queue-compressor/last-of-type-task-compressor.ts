import { ITaskQueueCompressor } from '../i-task-queue-compressor';
import { PortCommandTask, PortCommandTaskType } from '../../../models';

export class LastOfTypeTaskCompressor implements ITaskQueueCompressor {
    constructor(
        protected readonly taskType: PortCommandTaskType
    ) {
    }

    public compress(
        queue: PortCommandTask[]
    ): PortCommandTask[] {
        let lastCommandsOfType: PortCommandTask | null = null;

        for (let index = queue.length - 1; index >= 0; index--) {
            const command = queue[index];
            if (command.payload.taskType === this.taskType) {
                lastCommandsOfType = command;
                break;
            }
        }

        if (lastCommandsOfType === null) {
            return queue;
        }

        return queue.filter((command) => command.payload.taskType !== this.taskType || command === lastCommandsOfType);
    }
}
