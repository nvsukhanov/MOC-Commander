import { Injectable } from '@angular/core';
import { ITaskFilter, PortCommandTask, SpeedTaskPayload, TaskType } from '@app/store';

import { TaskHashBuilderService } from '../task-hash-builder.service';

@Injectable()
export class SpeedTaskFilterService implements ITaskFilter<TaskType.Speed> {
  constructor(private readonly hashBuilder: TaskHashBuilderService) {}

  public calculateNextPendingTask(
    currentTask: PortCommandTask | null,
    pendingTask: PortCommandTask | null,
    inputSliceTasks: Array<PortCommandTask<TaskType.Speed>>,
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
    newTask: PortCommandTask<TaskType.Speed>,
  ): PortCommandTask | null {
    if (previousTask && !this.isSpeedTask(previousTask)) {
      return newTask;
    }
    if (this.isTaskActive(newTask)) {
      if (!!previousTask && this.isTaskActive(previousTask)) {
        const newTaskHash = this.hashBuilder.calculateHash(newTask);
        const previousTaskHash = this.hashBuilder.calculateHash(previousTask);
        return newTaskHash === previousTaskHash ? previousTask : newTask;
      }
    } else {
      if (!previousTask) {
        return null;
      }
      const newTaskHash = this.hashBuilder.calculateHash(newTask);
      const previousTaskHash = this.hashBuilder.calculateHash(previousTask);
      if (previousTaskHash === newTaskHash) {
        return previousTask;
      }
    }
    return newTask;
  }

  private isSpeedTask(task: PortCommandTask): task is PortCommandTask<TaskType.Speed> {
    return task.payload.type === TaskType.Speed;
  }

  private isTaskActive(task: PortCommandTask<TaskType.Speed>): boolean {
    return task.payload.speed !== 0 || task.payload.brakeFactor !== 0;
  }

  private buildCombinedTask(tasks: Array<PortCommandTask<TaskType.Speed>>): PortCommandTask<TaskType.Speed> {
    if (!tasks.length) {
      throw new Error('Cannot build combined task from empty array');
    }

    if (tasks.length === 1) {
      return tasks[0];
    }
    const payload = tasks.reduce(
      (acc: SpeedTaskPayload, task) => {
        acc.speed += task.payload.speed;
        acc.brakeFactor += task.payload.brakeFactor;
        acc.useAccelerationProfile = acc.useAccelerationProfile || task.payload.useAccelerationProfile;
        acc.useDecelerationProfile = acc.useDecelerationProfile || task.payload.useDecelerationProfile;
        acc.power = Math.max(acc.power, task.payload.power);
        return acc;
      },
      {
        type: TaskType.Speed,
        speed: 0,
        brakeFactor: 0,
        useAccelerationProfile: false as boolean,
        useDecelerationProfile: false as boolean,
        power: 0,
      },
    );

    const inputTimestamp = tasks.reduce((acc, task) => Math.max(acc, task.inputTimestamp), 0);
    return {
      ...tasks[0],
      payload: payload,
      inputTimestamp,
    };
  }
}
