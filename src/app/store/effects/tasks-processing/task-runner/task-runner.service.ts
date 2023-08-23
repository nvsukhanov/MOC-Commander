import { Injectable } from '@angular/core';
import { IHub, PortCommandExecutionStatus } from '@nvsukhanov/rxpoweredup';
import { Observable } from 'rxjs';
import { ControlSchemeBindingType } from '@app/shared';

import { PortCommandTask } from '../../../models';
import { ITaskRunner } from './i-task-runner';
import { ServoTaskRunnerService, SetAngleTaskRunnerService, SetSpeedTaskRunnerService, StepperTaskRunnerService } from './runners';
import { SpeedStepperTaskRunnerService } from './runners/speed-stepper-task-runner.service';

@Injectable({ providedIn: 'root' })
export class TaskRunnerService implements ITaskRunner<ControlSchemeBindingType> {
    private readonly runnersMap: { [k in ControlSchemeBindingType]: ITaskRunner<k> } = {
        [ControlSchemeBindingType.Servo]: this.servoTaskRunnerService,
        [ControlSchemeBindingType.SetAngle]: this.setAngleTaskRunnerService,
        [ControlSchemeBindingType.Linear]: this.setSpeedTaskRunnerService,
        [ControlSchemeBindingType.Stepper]: this.stepperTaskRunnerService,
        [ControlSchemeBindingType.SpeedStepper]: this.speedStepperTaskRunnerService
    };

    constructor(
        private readonly servoTaskRunnerService: ServoTaskRunnerService,
        private readonly setAngleTaskRunnerService: SetAngleTaskRunnerService,
        private readonly setSpeedTaskRunnerService: SetSpeedTaskRunnerService,
        private readonly speedStepperTaskRunnerService: SpeedStepperTaskRunnerService,
        private readonly stepperTaskRunnerService: StepperTaskRunnerService
    ) {
    }

    public runTask<TBindingType extends ControlSchemeBindingType>(
        task: PortCommandTask<TBindingType>,
        hub: IHub
    ): Observable<PortCommandExecutionStatus> {
        const runner: ITaskRunner<TBindingType> = this.runnersMap[task.payload.bindingType];
        return runner.runTask(task, hub);
    }
}
