import { Injectable } from '@angular/core';
import { IHub, PortCommandExecutionStatus } from 'rxpoweredup';
import { Observable } from 'rxjs';
import { ControlSchemeBindingType } from '@app/shared-misc';
import { ITaskRunner, PortCommandTask } from '@app/store';

import { ServoBindingTaskRunnerService } from './servo';
import { SetAngleBindingTaskRunnerService } from './set-angle';
import { SpeedBindingTaskRunnerService } from './speed';
import { TrainBindingTaskRunnerService } from './train';
import { StepperBindingTaskRunnerService } from './stepper';
import { GearboxBindingTaskRunnerService } from './gearbox';
import { IBindingTaskRunner } from './i-binding-task-runner';

@Injectable()
export class BindingTaskRunnerService implements ITaskRunner {
    private readonly runnersMap: { [k in ControlSchemeBindingType]: IBindingTaskRunner<k> } = {
        [ControlSchemeBindingType.Servo]: this.servoBindingTaskRunnerService,
        [ControlSchemeBindingType.SetAngle]: this.setAngleBindingTaskRunnerService,
        [ControlSchemeBindingType.Speed]: this.speedBindingTaskRunnerService,
        [ControlSchemeBindingType.Stepper]: this.stepperBindingTaskRunnerService,
        [ControlSchemeBindingType.Train]: this.trainBindingTaskRunnerService,
        [ControlSchemeBindingType.Gearbox]: this.gearboxBindingTaskRunnerService,
    };

    constructor(
        private readonly servoBindingTaskRunnerService: ServoBindingTaskRunnerService,
        private readonly setAngleBindingTaskRunnerService: SetAngleBindingTaskRunnerService,
        private readonly speedBindingTaskRunnerService: SpeedBindingTaskRunnerService,
        private readonly trainBindingTaskRunnerService: TrainBindingTaskRunnerService,
        private readonly stepperBindingTaskRunnerService: StepperBindingTaskRunnerService,
        private readonly gearboxBindingTaskRunnerService: GearboxBindingTaskRunnerService
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
