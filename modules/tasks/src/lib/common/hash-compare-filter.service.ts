import { Injectable } from '@angular/core';
import { PortCommandTask } from '@app/store';

import { TaskHashBuilderService } from '../task-hash-builder.service';

@Injectable()
export class HashCompareFilterService {
  constructor(private hashBuilder: TaskHashBuilderService) {}

  public calculateNextPendingTask(
    currentTask: PortCommandTask | null,
    pendingTask: PortCommandTask | null,
    inputSliceTasks: Array<PortCommandTask>,
  ): PortCommandTask | null {
    const latestInputSliceTask = inputSliceTasks.reduce(
      (acc, task) => {
        if (!acc || task.inputTimestamp > acc.inputTimestamp) {
          return task;
        }
        return acc;
      },
      null as PortCommandTask | null,
    );
    if (!latestInputSliceTask) {
      return null;
    }
    const latestInputSliceTaskHash = this.hashBuilder.calculateHash(latestInputSliceTask);
    if (currentTask && this.hashBuilder.calculateHash(currentTask) === latestInputSliceTaskHash) {
      return null;
    }
    if (pendingTask && this.hashBuilder.calculateHash(pendingTask) === latestInputSliceTaskHash) {
      return pendingTask;
    }
    return latestInputSliceTask;
  }
}
