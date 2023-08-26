import { IHub, PortCommandExecutionStatus } from '@nvsukhanov/rxpoweredup';
import { Observable, last } from 'rxjs';
import { Injectable } from '@angular/core';
import { ControlSchemeBindingType } from '@app/shared';

import { PortCommandTask } from '../../../../models';
import { mapUseProfile } from '../map-use-profile';
import { ITaskRunner } from '../i-task-runner';

@Injectable({ providedIn: 'root' })
export class StepperTaskRunnerService implements ITaskRunner<ControlSchemeBindingType.Stepper> {
    public runTask(
        hub: IHub,
        task: PortCommandTask<ControlSchemeBindingType.Stepper>,
    ): Observable<PortCommandExecutionStatus> {
        return hub.motors.rotateByDegree(
            task.portId,
            task.payload.degree,
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
