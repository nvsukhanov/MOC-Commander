import { Injectable } from '@angular/core';
import { IHub, PortCommandExecutionStatus } from 'rxpoweredup';
import { Observable } from 'rxjs';
import { ITaskRunner, PortCommandTask, TaskType } from '@app/store';

import { SetAngleTaskRunnerService } from './set-angle';
import { SpeedTaskRunnerService } from './speed';
import { TrainTaskRunnerService } from './train';
import { StepperTaskRunnerService } from './stepper';
import { GearboxTaskRunnerService } from './gearbox';

@Injectable()
export class TaskRunnerService implements ITaskRunner {
  private readonly runnersMap: { [k in TaskType]: ITaskRunner<k> } = {
    [TaskType.SetAngle]: this.setAngleBindingTaskRunnerService,
    [TaskType.Speed]: this.speedBindingTaskRunnerService,
    [TaskType.Stepper]: this.stepperBindingTaskRunnerService,
    [TaskType.Train]: this.trainBindingTaskRunnerService,
    [TaskType.Gearbox]: this.gearboxBindingTaskRunnerService,
  };

  constructor(
    private readonly setAngleBindingTaskRunnerService: SetAngleTaskRunnerService,
    private readonly speedBindingTaskRunnerService: SpeedTaskRunnerService,
    private readonly trainBindingTaskRunnerService: TrainTaskRunnerService,
    private readonly stepperBindingTaskRunnerService: StepperTaskRunnerService,
    private readonly gearboxBindingTaskRunnerService: GearboxTaskRunnerService,
  ) {}

  public runTask<TTaskType extends TaskType>(
    hub: IHub,
    task: PortCommandTask<TTaskType>,
  ): Observable<PortCommandExecutionStatus> {
    const runner: ITaskRunner<TTaskType> = this.runnersMap[task.payload.type];
    return runner.runTask(hub, task);
  }
}
