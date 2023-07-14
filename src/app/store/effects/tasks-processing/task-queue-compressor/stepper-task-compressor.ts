import { ITaskQueueCompressor } from './i-task-queue-compressor';
import { PortCommandTask, PortCommandTaskType } from '../../../models';
import { StepperTaskBuilder } from '../task-builder/builders';

export class StepperTaskCompressor implements ITaskQueueCompressor {
    private taskBuilder = new StepperTaskBuilder();

    /**
     * Compresses stepper tasks into one task with accumulated degree
     * @param queue
     */
    public compress(
        queue: PortCommandTask[]
    ): PortCommandTask[] {
        let firstStepperTask: PortCommandTask<PortCommandTaskType.Stepper> | null = null;
        let totalStepperTaskCount = 0;
        let accumulatedDegree = 0;

        for (let index = 0; index < queue.length; index++) {
            const command = queue[index];
            if (command.payload.taskType === PortCommandTaskType.Stepper) {
                const task = command as PortCommandTask<PortCommandTaskType.Stepper>;
                if (totalStepperTaskCount === 0) {
                    firstStepperTask = task;
                }
                accumulatedDegree += task.payload.degree;
                totalStepperTaskCount++;
            }
        }

        if (totalStepperTaskCount > 1) {
            const result = queue.map((task) => {
                if (task === firstStepperTask) {
                    const updatedFirstTask: PortCommandTask<PortCommandTaskType.Stepper> = {
                        ...firstStepperTask,
                        payload: {
                            ...firstStepperTask.payload,
                            degree: accumulatedDegree,

                        }
                    };
                    updatedFirstTask.hash = this.taskBuilder.calculatePayloadHash(updatedFirstTask.payload);
                    return updatedFirstTask;
                }
                if (task.payload.taskType === PortCommandTaskType.Stepper) {
                    return null;
                }
                return task;
            }).filter((task) => task !== null) as PortCommandTask[];
            return result;
        }
        return queue;
    }
}
