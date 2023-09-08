import { ControlSchemeBindingType } from '@app/shared';
import { PortCommandTask, SetSpeedTaskPayload } from '@app/store';

import { AccumulatingTaskCompressor } from './accumulating-task-compressor';
import { snapSpeed } from '../task-factory';

export class SetSpeedQueueCompressor extends AccumulatingTaskCompressor<ControlSchemeBindingType.SetSpeed> {
    constructor() {
        super(ControlSchemeBindingType.SetSpeed);
    }

    protected override buildPayloadChanges(
        accumulatedTasks: Array<PortCommandTask<ControlSchemeBindingType.SetSpeed>>
    ): Partial<SetSpeedTaskPayload> {
        const latestBindingTasksMap = this.getLatestBindingTasks(accumulatedTasks);

        let speedTask: PortCommandTask<ControlSchemeBindingType.SetSpeed> | undefined;
        let combinedSpeed = 0;
        let combinedBrakeFactor = 0;
        let combinedUseAccelerationProfile = false;
        let combinedUseDecelerationProfile = false;
        let maxTimestamp = 0;
        let maxPower = 0;

        for (const task of latestBindingTasksMap.values()) {
            if (task.payload.bindingType !== ControlSchemeBindingType.SetSpeed) {
                continue;
            }

            if (!speedTask || (speedTask.bindingId === task.bindingId && speedTask.inputTimestamp < task.inputTimestamp)) {
                speedTask = task as PortCommandTask<ControlSchemeBindingType.SetSpeed>;
                combinedSpeed = task.payload.speed;
                combinedBrakeFactor = task.payload.brakeFactor;
                combinedUseAccelerationProfile = task.payload.useAccelerationProfile;
                combinedUseDecelerationProfile = task.payload.useDecelerationProfile;
                maxTimestamp = task.inputTimestamp;
                maxPower = task.payload.power;
                continue;
            }

            maxTimestamp = Math.max(maxTimestamp, task.inputTimestamp);
            combinedSpeed = combinedSpeed + task.payload.speed;
            combinedBrakeFactor = combinedBrakeFactor + task.payload.brakeFactor;
            combinedUseAccelerationProfile = combinedUseAccelerationProfile || task.payload.useAccelerationProfile;
            combinedUseDecelerationProfile = combinedUseDecelerationProfile || task.payload.useDecelerationProfile;
            maxPower = Math.max(maxPower, task.payload.power);
        }

        return {
            speed: snapSpeed(combinedSpeed),
            brakeFactor: combinedBrakeFactor,
            useAccelerationProfile: combinedUseAccelerationProfile,
            useDecelerationProfile: combinedUseDecelerationProfile,
            power: maxPower
        };
    }

    private getLatestBindingTasks(
        accumulatedTasks: Array<PortCommandTask<ControlSchemeBindingType.SetSpeed>>
    ): Map<number, PortCommandTask<ControlSchemeBindingType.SetSpeed>> {
        const latestBindingTasksMap: Map<number, PortCommandTask<ControlSchemeBindingType.SetSpeed>> = new Map();

        for (const task of accumulatedTasks) {
            const existingTask = latestBindingTasksMap.get(task.bindingId);
            if (!existingTask || existingTask.inputTimestamp < task.inputTimestamp) {
                latestBindingTasksMap.set(task.bindingId, task as PortCommandTask<ControlSchemeBindingType.SetSpeed>);
            }
        }
        return latestBindingTasksMap;
    }
}
