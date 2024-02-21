import { Injectable } from '@angular/core';
import { ControlSchemeBindingType, calculateSpeedPower } from '@app/shared-misc';
import { PortCommandTask, SetSpeedTaskPayload } from '@app/store';

import { setSpeedPayloadHash } from './set-speed-payload-hash';
import { IBindingTaskFilter } from '../i-binding-task-filter';

@Injectable()
export class SetSpeedFilterService implements IBindingTaskFilter<ControlSchemeBindingType.SetSpeed> {
    public calculateNextPendingTask(
        currentTask: PortCommandTask | null,
        pendingTask: PortCommandTask | null,
        inputSliceTasks: Array<PortCommandTask<ControlSchemeBindingType.SetSpeed>>,
    ): PortCommandTask | null {
        const combinedTask = this.buildCombinedTask(inputSliceTasks);
        const currentTaskReplacement = this.shouldReplaceTask(currentTask, combinedTask);
        if (currentTaskReplacement && currentTaskReplacement === currentTask) {
            return null;
        } else if (currentTaskReplacement) {
            return currentTaskReplacement;
        }
        return this.shouldReplaceTask(pendingTask, combinedTask);
    }

    private shouldReplaceTask(
        previousTask: PortCommandTask | null,
        newTask: PortCommandTask<ControlSchemeBindingType.SetSpeed>
    ): PortCommandTask | null {
        if (previousTask && !this.isSetSpeedTask(previousTask)) {
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

    private isSetSpeedTask(
        task: PortCommandTask
    ): task is PortCommandTask<ControlSchemeBindingType.SetSpeed> {
        return task.payload.bindingType === ControlSchemeBindingType.SetSpeed;
    }

    private isTaskActive(
        task: PortCommandTask<ControlSchemeBindingType.SetSpeed>
    ): boolean {
        return task.payload.speed !== 0 || task.payload.brakeFactor !== 0;
    }

    private buildCombinedTask(
        tasks: Array<PortCommandTask<ControlSchemeBindingType.SetSpeed>>
    ): PortCommandTask<ControlSchemeBindingType.SetSpeed> {
        if (!tasks.length) {
            throw new Error('Cannot build combined task from empty array');
        }

        if (tasks.length === 1) {
            return tasks[0];
        }
        const payload = tasks.reduce((acc: SetSpeedTaskPayload, task) => {
            acc.speed += task.payload.speed;
            acc.brakeFactor += task.payload.brakeFactor;
            acc.useAccelerationProfile = acc.useAccelerationProfile || task.payload.useAccelerationProfile;
            acc.useDecelerationProfile = acc.useDecelerationProfile || task.payload.useDecelerationProfile;
            acc.power = Math.max(acc.power, task.payload.power);
            return acc;
        }, {
            bindingType: ControlSchemeBindingType.SetSpeed,
            speed: 0,
            brakeFactor: 0,
            useAccelerationProfile: false as boolean,
            useDecelerationProfile: false as boolean,
            power: 0,
        });

        const inputTimestamp = tasks.reduce((acc, task) => Math.max(acc, task.inputTimestamp), 0);
        const { speed, power } = calculateSpeedPower(payload.speed, payload.brakeFactor, payload.power);
        return {
            ...tasks[0],
            payload: {
                ...payload,
                speed,
                power,
                brakeFactor: 0
            },
            inputTimestamp,
            hash: setSpeedPayloadHash(payload)
        };
    }
}
