import { Injectable } from '@angular/core';
import { ITaskFilter, PortCommandTask, PowerTaskPayload, TaskType } from '@app/store';

import { TaskHashBuilderService } from '../task-hash-builder.service';

@Injectable()
export class PowerTaskFilterService implements ITaskFilter<TaskType.Power> {
  constructor(private readonly hashBuilder: TaskHashBuilderService) {}

  public calculateNextPendingTask(
    currentTask: PortCommandTask | null,
    pendingTask: PortCommandTask | null,
    inputSliceTasks: Array<PortCommandTask<TaskType.Power>>,
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
    newTask: PortCommandTask<TaskType.Power>,
  ): PortCommandTask | null {
    if (previousTask && !this.isPowerTask(previousTask)) {
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

  private isPowerTask(task: PortCommandTask): task is PortCommandTask<TaskType.Power> {
    return task.payload.type === TaskType.Power;
  }

  private isTaskActive(task: PortCommandTask<TaskType.Power>): boolean {
    return task.payload.power !== 0;
  }

  private buildCombinedTask(tasks: Array<PortCommandTask<TaskType.Power>>): PortCommandTask<TaskType.Power> {
    if (!tasks.length) {
      throw new Error('Cannot build combined task from empty array');
    }

    if (tasks.length === 1) {
      return tasks[0];
    }
    const payload = tasks.reduce(
      (acc: PowerTaskPayload, task) => {
        acc.power += task.payload.power;
        acc.modeId = task.payload.modeId;
        return acc;
      },
      {
        type: TaskType.Power,
        power: 0,
        modeId: 0,
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
