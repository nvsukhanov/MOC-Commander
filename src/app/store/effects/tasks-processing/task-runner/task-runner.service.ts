import { Injectable } from '@angular/core';
import { IHub, PortCommandExecutionStatus } from 'rxpoweredup';
import { Observable } from 'rxjs';
import { ControlSchemeBindingType } from '@app/shared';

import { PortCommandTask } from '../../../models';
import { ITaskRunner } from './i-task-runner';
import {
    AngleShiftTaskRunnerService,
    ServoTaskRunnerService,
    SetAngleTaskRunnerService,
    SetSpeedTaskRunnerService,
    SpeedShiftTaskRunnerService,
    StepperTaskRunnerService
} from './runners';

@Injectable({ providedIn: 'root' })
export class TaskRunnerService implements ITaskRunner<ControlSchemeBindingType> {
    private readonly runnersMap: { [k in ControlSchemeBindingType]: ITaskRunner<k> } = {
        [ControlSchemeBindingType.Servo]: this.servoTaskRunnerService,
        [ControlSchemeBindingType.SetAngle]: this.setAngleTaskRunnerService,
        [ControlSchemeBindingType.SetSpeed]: this.setSpeedTaskRunnerService,
        [ControlSchemeBindingType.Stepper]: this.stepperTaskRunnerService,
        [ControlSchemeBindingType.SpeedShift]: this.speedShiftTaskRunnerService,
        [ControlSchemeBindingType.AngleShift]: this.angleShiftTaskRunnerService,
    };

    constructor(
        private readonly servoTaskRunnerService: ServoTaskRunnerService,
        private readonly setAngleTaskRunnerService: SetAngleTaskRunnerService,
        private readonly setSpeedTaskRunnerService: SetSpeedTaskRunnerService,
        private readonly speedShiftTaskRunnerService: SpeedShiftTaskRunnerService,
        private readonly stepperTaskRunnerService: StepperTaskRunnerService,
        private readonly angleShiftTaskRunnerService: AngleShiftTaskRunnerService
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
