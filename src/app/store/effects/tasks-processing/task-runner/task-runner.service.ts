import { Injectable } from '@angular/core';
import { IHub, PortCommandExecutionStatus } from '@nvsukhanov/rxpoweredup';
import { Observable } from 'rxjs';
import { ControlSchemeBindingType } from '@app/shared';

import { PortCommandTask } from '../../../models';
import { ITaskRunner } from './i-task-runner';
import { ServoTaskRunnerService, SetAngleTaskRunnerService, SetSpeedTaskRunnerService, SpeedShiftTaskRunnerService, StepperTaskRunnerService } from './runners';

@Injectable({ providedIn: 'root' })
export class TaskRunnerService implements ITaskRunner<ControlSchemeBindingType> {
    private readonly runnersMap: { [k in ControlSchemeBindingType]: ITaskRunner<k> } = {
        [ControlSchemeBindingType.Servo]: this.servoTaskRunnerService,
        [ControlSchemeBindingType.SetAngle]: this.setAngleTaskRunnerService,
        [ControlSchemeBindingType.Linear]: this.setSpeedTaskRunnerService,
        [ControlSchemeBindingType.Stepper]: this.stepperTaskRunnerService,
        [ControlSchemeBindingType.SpeedShift]: this.speedShiftTaskRunnerService
    };

    constructor(
        private readonly servoTaskRunnerService: ServoTaskRunnerService,
        private readonly setAngleTaskRunnerService: SetAngleTaskRunnerService,
        private readonly setSpeedTaskRunnerService: SetSpeedTaskRunnerService,
        private readonly speedShiftTaskRunnerService: SpeedShiftTaskRunnerService,
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
