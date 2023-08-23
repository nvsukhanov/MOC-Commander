import { ControlSchemeBindingType } from '@app/shared';

import { ITaskQueueCompressor } from '../i-task-queue-compressor';
import { PortCommandTask } from '../../../models';

export class LastOfTypeTaskCompressor implements ITaskQueueCompressor {
    constructor(
        protected readonly taskType: ControlSchemeBindingType
    ) {
    }

    public compress(
        queue: PortCommandTask[]
    ): PortCommandTask[] {
        let lastCommandsOfType: PortCommandTask | null = null;

        for (let index = queue.length - 1; index >= 0; index--) {
            const command = queue[index];
            if (command.payload.bindingType === this.taskType) {
                lastCommandsOfType = command;
                break;
            }
        }

        if (lastCommandsOfType === null) {
            return queue;
        }

        return queue.filter((command) => command.payload.bindingType !== this.taskType || command === lastCommandsOfType);
    }
}
