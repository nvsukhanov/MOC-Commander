import { ITaskSpecificQueueCompressor } from '../i-task-specific-queue-compressor';
import { PortCommandSetLinearSpeedTask, PortCommandTask, PortCommandTaskType } from '../../task-composer';

export class SetSpeedTaskQueueCompressor implements ITaskSpecificQueueCompressor {
    public compress(queue: PortCommandTask[]): PortCommandTask[] {
        const lastCommandsOfTypeMap = new Map<string, PortCommandSetLinearSpeedTask>();
        const commandHashMap = new Map<PortCommandSetLinearSpeedTask, string>(
            queue.map((command) => [ command, this.outputHash(command) ])
        );

        for (let index = queue.length - 1; index >= 0; index--) {
            const command = queue[index];
            if (command.taskType === PortCommandTaskType.SetSpeed) {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                const hash = commandHashMap.get(command)!;
                if (!lastCommandsOfTypeMap.has(hash)) {
                    lastCommandsOfTypeMap.set(hash, command);
                }
            }
        }

        return queue.filter((command) => {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const commandHash = commandHashMap.get(command)!;
            const lastCommand = lastCommandsOfTypeMap.get(commandHash);
            return !lastCommand || lastCommand === command;
        });
    }

    private outputHash(command: PortCommandSetLinearSpeedTask): string {
        return `${command.hubId}/${command.portId}`;
    }
}
