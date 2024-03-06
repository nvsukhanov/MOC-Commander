import { IHub, PortCommandExecutionStatus } from 'rxpoweredup';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { ControlSchemeBindingType } from '@app/shared-misc';
import { PortCommandTask } from '@app/store';

import { mapUseProfile } from '../common';
import { IBindingTaskRunner } from '../i-binding-task-runner';

@Injectable()
export class TrainBindingTaskRunnerService implements IBindingTaskRunner<ControlSchemeBindingType.Train> {
    public runTask(
        hub: IHub,
        task: PortCommandTask<ControlSchemeBindingType.Train>,
    ): Observable<PortCommandExecutionStatus> {
        return hub.motors.startSpeed(
            task.portId,
            task.payload.speed,
            {
                power: task.payload.power,
                useProfile: mapUseProfile(task.payload)
            }
        );
    }
}
