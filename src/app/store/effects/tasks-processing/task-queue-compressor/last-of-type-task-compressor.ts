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
        const lastCommandsOfType = queue.reduce((acc, val) => {
            if (val.payload.bindingType !== this.taskType) {
                return acc;
            }
            if (!acc || val.inputTimestamp > acc.inputTimestamp) {
                return val;
            }
            return acc;
        }, null as PortCommandTask | null);

        if (lastCommandsOfType === null) {
            return queue;
        }

        return queue.filter((command) => command.payload.bindingType !== this.taskType || command === lastCommandsOfType);
    }
}
