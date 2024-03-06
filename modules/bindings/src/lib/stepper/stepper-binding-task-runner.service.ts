import { IHub, PortCommandExecutionStatus } from 'rxpoweredup';
import { Observable, last } from 'rxjs';
import { Injectable } from '@angular/core';
import { ControlSchemeBindingType } from '@app/shared-misc';
import { PortCommandTask, StepperBindingInputAction } from '@app/store';

import { mapUseProfile } from '../common';
import { IBindingTaskRunner } from '../i-binding-task-runner';

@Injectable()
export class StepperBindingTaskRunnerService implements IBindingTaskRunner<ControlSchemeBindingType.Stepper> {
    public runTask(
        hub: IHub,
        task: PortCommandTask<ControlSchemeBindingType.Stepper>,
    ): Observable<PortCommandExecutionStatus> {
        return hub.motors.rotateByDegree(
            task.portId,
            task.payload.degree * (task.payload.action === StepperBindingInputAction.Cw ? 1 : -1),
            {
                speed: task.payload.speed,
                power: task.payload.power,
                useProfile: mapUseProfile(task.payload),
                endState: task.payload.endState
            }
        ).pipe(
            last()
        );
    }
}
