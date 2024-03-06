import { Injectable } from '@angular/core';
import { IHub, PortCommandExecutionStatus } from 'rxpoweredup';
import { Observable, first } from 'rxjs';
import { ControlSchemeBindingType } from '@app/shared-misc';
import { PortCommandTask } from '@app/store';

import { IBindingTaskRunner } from '../i-binding-task-runner';
import { mapUseProfile } from '../common';

@Injectable()
export class GearboxBindingTaskRunnerService implements IBindingTaskRunner<ControlSchemeBindingType.Gearbox> {
    public runTask(
        hub: IHub,
        task: PortCommandTask<ControlSchemeBindingType.Gearbox>
    ): Observable<PortCommandExecutionStatus> {
        return hub.motors.goToPosition(
            task.portId,
            task.payload.angle - task.payload.offset,
            {
                speed: task.payload.speed,
                power: task.payload.power,
                endState: task.payload.endState,
                useProfile: mapUseProfile(task.payload)
            }
        ).pipe(
            first()
        );
    }
}
