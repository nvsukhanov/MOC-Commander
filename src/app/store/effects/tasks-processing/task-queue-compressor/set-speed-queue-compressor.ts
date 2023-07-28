import { PortCommandTask, PortCommandTaskType } from '@app/store';

import { ITaskQueueCompressor } from '../i-task-queue-compressor';

export class SetSpeedQueueCompressor implements ITaskQueueCompressor {
    public compress(
        queue: PortCommandTask[]
    ): PortCommandTask[] {
        let lastSpeedTask: PortCommandTask<PortCommandTaskType.SetSpeed> | null = null;

        // create new array with same length as queue (to avoid array resizing)
        const resultingQueue: PortCommandTask[] = new Array<PortCommandTask>(queue.length);

        for (let index = queue.length - 1; index >= 0; index--) {
            const task = queue[index];
            if (task.payload.taskType !== PortCommandTaskType.SetSpeed) {
                resultingQueue[index] = task;
                continue;
            }

            if (!lastSpeedTask) {
                lastSpeedTask = task as PortCommandTask<PortCommandTaskType.SetSpeed>;
                resultingQueue[index] = task;
                continue;
            }

            // update last speed task payload if last speed task payload is not active and current task payload is active
            if (!lastSpeedTask.payload.activeInput && task.payload.activeInput) {
                lastSpeedTask.bindingId = task.bindingId;
                lastSpeedTask.payload = task.payload;
                lastSpeedTask.hash = task.hash;
            }
        }

        // normalize resulting queue
        return resultingQueue.filter((task) => !!task);
    }
}
