import { Injectable } from '@angular/core';
import { IHub, PortCommandExecutionStatus } from 'rxpoweredup';
import { Observable } from 'rxjs';
import { ControlSchemeBindingType } from '@app/shared';

import { PortCommandTask } from '../../../models';
import { ITaskRunner } from './i-task-runner';
import {
    GearboxControlTaskRunnerService,
    ServoTaskRunnerService,
    SetAngleTaskRunnerService,
    SetSpeedTaskRunnerService,
    StepperTaskRunnerService,
    TrainControlTaskRunnerService
} from './runners';

@Injectable({ providedIn: 'root' })
export class TaskRunnerService implements ITaskRunner<ControlSchemeBindingType> {
    private readonly runnersMap: { [k in ControlSchemeBindingType]: ITaskRunner<k> } = {
        [ControlSchemeBindingType.Servo]: this.servoTaskRunnerService,
        [ControlSchemeBindingType.SetAngle]: this.setAngleTaskRunnerService,
        [ControlSchemeBindingType.SetSpeed]: this.setSpeedTaskRunnerService,
        [ControlSchemeBindingType.Stepper]: this.stepperTaskRunnerService,
        [ControlSchemeBindingType.TrainControl]: this.trainControlTaskRunnerService,
        [ControlSchemeBindingType.GearboxControl]: this.gearboxControlTaskRunnerService,
    };

    constructor(
        private readonly servoTaskRunnerService: ServoTaskRunnerService,
        private readonly setAngleTaskRunnerService: SetAngleTaskRunnerService,
        private readonly setSpeedTaskRunnerService: SetSpeedTaskRunnerService,
        private readonly trainControlTaskRunnerService: TrainControlTaskRunnerService,
        private readonly stepperTaskRunnerService: StepperTaskRunnerService,
        private readonly gearboxControlTaskRunnerService: GearboxControlTaskRunnerService
    ) {
    }

    public runTask<TBindingType extends ControlSchemeBindingType>(
        hub: IHub,
        task: PortCommandTask<TBindingType>,
    ): Observable<PortCommandExecutionStatus> {
        const runner: ITaskRunner<TBindingType> = this.runnersMap[task.payload.bindingType];
        return runner.runTask(hub, task);
    }
}
