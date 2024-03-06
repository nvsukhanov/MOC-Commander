import { Injectable } from '@angular/core';
import { ControlSchemeBindingType } from '@app/shared-misc';
import { PortCommandTask, SpeedTaskPayload } from '@app/store';

import { speedBindingPayloadHash } from './speed-binding-payload-hash';
import { IBindingTaskFilter } from '../i-binding-task-filter';
import { calculateTaskHash } from '../common';

@Injectable()
export class SpeedBindingTaskFilterService implements IBindingTaskFilter<ControlSchemeBindingType.Speed> {
    public calculateNextPendingTask(
        currentTask: PortCommandTask | null,
        pendingTask: PortCommandTask | null,
        inputSliceTasks: Array<PortCommandTask<ControlSchemeBindingType.Speed>>,
    ): PortCommandTask | null {
        const combinedTask = this.buildCombinedTask(inputSliceTasks);
        const currentTaskReplacement = this.shouldReplaceTask(currentTask, combinedTask);
        if (currentTaskReplacement && currentTaskReplacement === currentTask) {
            return null;
        } else if (currentTaskReplacement) {
            return currentTaskReplacement;
        }
        const result = this.shouldReplaceTask(pendingTask, combinedTask);
        return result;
    }

    private shouldReplaceTask(
        previousTask: PortCommandTask | null,
        newTask: PortCommandTask<ControlSchemeBindingType.Speed>
    ): PortCommandTask | null {
        if (previousTask && !this.isSpeedTask(previousTask)) {
            return newTask;
        }
        if (this.isTaskActive(newTask)) {
            if (!!previousTask && this.isTaskActive(previousTask)) {
                return newTask.hash === previousTask.hash ? previousTask : newTask;
            }
        } else {
            if (!previousTask) {
                return null;
            }
            if (previousTask.hash === newTask.hash) {
                return previousTask;
            }
        }
        return newTask;
    }

    private isSpeedTask(
        task: PortCommandTask
    ): task is PortCommandTask<ControlSchemeBindingType.Speed> {
        return task.payload.bindingType === ControlSchemeBindingType.Speed;
    }

    private isTaskActive(
        task: PortCommandTask<ControlSchemeBindingType.Speed>
    ): boolean {
        return task.payload.speed !== 0 || task.payload.brakeFactor !== 0;
    }

    private buildCombinedTask(
        tasks: Array<PortCommandTask<ControlSchemeBindingType.Speed>>
    ): PortCommandTask<ControlSchemeBindingType.Speed> {
        if (!tasks.length) {
            throw new Error('Cannot build combined task from empty array');
        }

        if (tasks.length === 1) {
            return tasks[0];
        }
        const payload = tasks.reduce((acc: SpeedTaskPayload, task) => {
            acc.speed += task.payload.speed;
            acc.brakeFactor += task.payload.brakeFactor;
            acc.useAccelerationProfile = acc.useAccelerationProfile || task.payload.useAccelerationProfile;
            acc.useDecelerationProfile = acc.useDecelerationProfile || task.payload.useDecelerationProfile;
            acc.power = Math.max(acc.power, task.payload.power);
            return acc;
        }, {
            bindingType: ControlSchemeBindingType.Speed,
            speed: 0,
            brakeFactor: 0,
            useAccelerationProfile: false as boolean,
            useDecelerationProfile: false as boolean,
            power: 0,
        });

        const inputTimestamp = tasks.reduce((acc, task) => Math.max(acc, task.inputTimestamp), 0);
        return {
            ...tasks[0],
            payload: payload,
            inputTimestamp,
            hash: calculateTaskHash(tasks[0].hubId, tasks[0].portId, speedBindingPayloadHash(payload))
        };
    }
}
