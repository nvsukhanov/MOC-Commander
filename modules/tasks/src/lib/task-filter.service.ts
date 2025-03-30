import { Injectable } from '@angular/core';
import { ITaskFilter, PortCommandTask, TaskType } from '@app/store';

import { HashCompareFilterService, MostRecentTaskFilterService } from './common';
import { SpeedTaskFilterService } from './speed';
import { PowerTaskFilterService } from './power';

@Injectable()
export class TaskFilterService implements ITaskFilter {
  private readonly filters: { [k in TaskType]: ITaskFilter<k> } = {
    [TaskType.Speed]: this.speedTaskFilterService,
    [TaskType.SetAngle]: this.hashCompareFilter,
    [TaskType.Stepper]: this.mostRecentTaskFilter,
    [TaskType.Train]: this.hashCompareFilter,
    [TaskType.Gearbox]: this.hashCompareFilter,
    [TaskType.Power]: this.powerTaskFilterService,
  };

  constructor(
    private readonly mostRecentTaskFilter: MostRecentTaskFilterService,
    private readonly speedTaskFilterService: SpeedTaskFilterService,
    private readonly hashCompareFilter: HashCompareFilterService,
    private readonly powerTaskFilterService: PowerTaskFilterService,
  ) {}

  public calculateNextPendingTask(
    currentTask: PortCommandTask | null,
    pendingTask: PortCommandTask | null,
    inputSliceTasks: Array<PortCommandTask>,
  ): PortCommandTask | null {
    const mostRecentTaskType = this.getMostRecentTaskType(inputSliceTasks);
    if (mostRecentTaskType === null) {
      return null;
    }
    const filteredQueue = this.filterQueue(inputSliceTasks, mostRecentTaskType) as Array<
      PortCommandTask<typeof mostRecentTaskType>
    >;
    const filter = this.filters[mostRecentTaskType] as ITaskFilter<typeof mostRecentTaskType>;
    return filter.calculateNextPendingTask(currentTask, pendingTask, filteredQueue);
  }

  private getMostRecentTaskType(tasks: PortCommandTask[]): TaskType | null {
    const mostRecentTask = tasks.reduce(
      (acc, task) => {
        if (!acc || task.inputTimestamp > acc.inputTimestamp) {
          return task;
        }
        return acc;
      },
      null as null | PortCommandTask,
    );
    return mostRecentTask?.payload.type ?? null;
  }

  private filterQueue<TTaskType extends TaskType>(
    queue: PortCommandTask[],
    taskType: TTaskType,
  ): PortCommandTask<TTaskType>[] {
    return queue.filter((task): task is PortCommandTask<TTaskType> => task.payload.type === taskType);
  }
}
