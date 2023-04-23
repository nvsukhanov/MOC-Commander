import { ITaskSpecificQueueCompressor } from '../i-task-specific-queue-compressor';
import { PortCommandSetLinearSpeedTask, PortCommandTask, PortCommandTaskType } from '../../task-composer';

export class SetSpeedTaskQueueCompressor implements ITaskSpecificQueueCompressor {
    public compress(queue: PortCommandTask[]): PortCommandTask[] {
        let data: {
            firstCommand: PortCommandSetLinearSpeedTask,
            lastCommand: PortCommandSetLinearSpeedTask,
            firstCommandIndex: number,
        } | undefined;

        for (let i = 0; i < queue.length; i++) {
            const command = queue[i];
            if (command.taskType === PortCommandTaskType.SetSpeed) {
                if (data) {
                    data.lastCommand = command;
                } else {
                    data = {
                        firstCommand: command,
                        lastCommand: command,
                        firstCommandIndex: i,
                    };
                }
            }
        }

        if (data && data.firstCommand !== data.lastCommand) {
            const compressedTask: PortCommandSetLinearSpeedTask = { ...data.firstCommand, speed: data.lastCommand.speed };
            const filteredQueue = queue.filter((command) => command.taskType !== PortCommandTaskType.SetSpeed);
            filteredQueue.splice(data.firstCommandIndex, 0, compressedTask);
            return filteredQueue;
        }
        return queue;
    }
}
