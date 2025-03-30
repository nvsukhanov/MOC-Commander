import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { PortCommandTask, TaskType } from '@app/store';
import { IPortCommandTaskSummaryBuilder } from '@app/shared-control-schemes';

import { GearboxTaskL10nService } from './gearbox';
import { SetAngleTaskL10nService } from './set-angle';
import { SpeedTaskL10nService } from './speed';
import { StepperTaskL10nService } from './stepper';
import { TrainTaskL10nService } from './train';
import { PowerTaskL10nService } from './power';

@Injectable()
export class TaskSummaryBuilderService implements IPortCommandTaskSummaryBuilder {
  private readonly bindingL10nServices: { [k in TaskType]: IPortCommandTaskSummaryBuilder<k> } = {
    [TaskType.Gearbox]: this.gearboxTaskL10nService,
    [TaskType.SetAngle]: this.setAngleTaskL10nService,
    [TaskType.Speed]: this.speedTaskL10nService,
    [TaskType.Stepper]: this.stepperTaskL10nService,
    [TaskType.Train]: this.trainTaskL10nService,
    [TaskType.Power]: this.powerTaskL10nService,
  };

  constructor(
    private readonly gearboxTaskL10nService: GearboxTaskL10nService,
    private readonly setAngleTaskL10nService: SetAngleTaskL10nService,
    private readonly speedTaskL10nService: SpeedTaskL10nService,
    private readonly stepperTaskL10nService: StepperTaskL10nService,
    private readonly trainTaskL10nService: TrainTaskL10nService,
    private readonly powerTaskL10nService: PowerTaskL10nService,
  ) {}

  public buildTaskSummary<T extends TaskType>(portCommandTask: PortCommandTask<T>): Observable<string> {
    const l10nService: IPortCommandTaskSummaryBuilder<T> = this.bindingL10nServices[portCommandTask.payload.type];
    return l10nService.buildTaskSummary(portCommandTask);
  }
}
