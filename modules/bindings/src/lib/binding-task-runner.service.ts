import { Injectable } from '@angular/core';
import { IHub, PortCommandExecutionStatus } from 'rxpoweredup';
import { Observable } from 'rxjs';
import { ControlSchemeBindingType } from '@app/shared-misc';
import { ITaskRunner, PortCommandTask } from '@app/store';

import { ServoTaskRunnerService } from './servo';
import { SetAngleTaskRunnerService } from './set-angle';
import { SpeedTaskRunnerService } from './speed';
import { TrainControlTaskRunnerService } from './train-control';
import { StepperTaskRunnerService } from './stepper';
import { GearboxControlTaskRunnerService } from './gearbox';
import { IBindingTaskRunner } from './i-binding-task-runner';

@Injectable()
export class BindingTaskRunnerService implements ITaskRunner {
    private readonly runnersMap: { [k in ControlSchemeBindingType]: IBindingTaskRunner<k> } = {
        [ControlSchemeBindingType.Servo]: this.servoTaskRunnerService,
        [ControlSchemeBindingType.SetAngle]: this.setAngleTaskRunnerService,
        [ControlSchemeBindingType.Speed]: this.speedTaskRunnerService,
        [ControlSchemeBindingType.Stepper]: this.stepperTaskRunnerService,
        [ControlSchemeBindingType.TrainControl]: this.trainControlTaskRunnerService,
        [ControlSchemeBindingType.GearboxControl]: this.gearboxControlTaskRunnerService,
    };

    constructor(
        private readonly servoTaskRunnerService: ServoTaskRunnerService,
        private readonly setAngleTaskRunnerService: SetAngleTaskRunnerService,
        private readonly speedTaskRunnerService: SpeedTaskRunnerService,
        private readonly trainControlTaskRunnerService: TrainControlTaskRunnerService,
        private readonly stepperTaskRunnerService: StepperTaskRunnerService,
        private readonly gearboxControlTaskRunnerService: GearboxControlTaskRunnerService
    ) {
    }

    public runTask<TBindingType extends ControlSchemeBindingType>(
        hub: IHub,
        task: PortCommandTask<TBindingType>,
    ): Observable<PortCommandExecutionStatus> {
        const runner: IBindingTaskRunner<TBindingType> = this.runnersMap[task.payload.bindingType];
        return runner.runTask(hub, task);
    }
}
