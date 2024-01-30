import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IPortCommandTaskSummaryBuilder } from '@app/control-scheme-view';
import { PortCommandTask } from '@app/store';
import { ControlSchemeBindingType } from '@app/shared-misc';

import { SetSpeedPortCommandTaskSummaryBuilderService } from './set-speed';
import { SetAnglePortCommandTaskSummaryBuilderService } from './set-angle';
import { ServoPortCommandTaskSummaryBuilderService } from './servo';
import { StepperPortCommandTaskSummaryBuilderService } from './stepper';
import { TrainControlPortCommandTaskSummaryBuilderService } from './train-control';
import { GearboxControlPortCommandTaskSummaryBuilderService } from './gearbox';
import { IBindingTaskSummaryBuilder } from './i-binding-task-summary-builder';

@Injectable()
export class BindingTaskSummaryBuilderService implements IPortCommandTaskSummaryBuilder {
    private readonly builders: { [k in ControlSchemeBindingType]: IBindingTaskSummaryBuilder<k> } = {
        [ControlSchemeBindingType.SetSpeed]: this.setSpeedPortCommandTaskSummaryBuilder,
        [ControlSchemeBindingType.SetAngle]: this.setAnglePortCommandTaskSummaryBuilder,
        [ControlSchemeBindingType.Servo]: this.servoPortCommandTaskSummaryBuilder,
        [ControlSchemeBindingType.Stepper]: this.stepperPortCommandTaskSummaryBuilder,
        [ControlSchemeBindingType.TrainControl]: this.trainControlPortCommandTaskSummaryBuilder,
        [ControlSchemeBindingType.GearboxControl]: this.gearboxControlPortCommandTaskSummaryBuilder
    };

    constructor(
        private readonly setSpeedPortCommandTaskSummaryBuilder: SetSpeedPortCommandTaskSummaryBuilderService,
        private readonly setAnglePortCommandTaskSummaryBuilder: SetAnglePortCommandTaskSummaryBuilderService,
        private readonly servoPortCommandTaskSummaryBuilder: ServoPortCommandTaskSummaryBuilderService,
        private readonly stepperPortCommandTaskSummaryBuilder: StepperPortCommandTaskSummaryBuilderService,
        private readonly trainControlPortCommandTaskSummaryBuilder: TrainControlPortCommandTaskSummaryBuilderService,
        private readonly gearboxControlPortCommandTaskSummaryBuilder: GearboxControlPortCommandTaskSummaryBuilderService,
    ) {
    }

    public buildTaskSummary(
        portCommandTask: PortCommandTask
    ): Observable<string> {
        return this.getBuilder(portCommandTask).buildTaskSummary(portCommandTask);
    }

    private getBuilder<T extends ControlSchemeBindingType>(
        task: PortCommandTask<T>
    ): IBindingTaskSummaryBuilder<T> {
        return this.builders[task.payload.bindingType];
    }
}
