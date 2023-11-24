import { IHub, PortCommandExecutionStatus } from 'rxpoweredup';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { ControlSchemeBindingType } from '@app/shared-misc';

import { PortCommandTask } from '../../../../models';
import { mapUseProfile } from '../map-use-profile';
import { ITaskRunner } from '../i-task-runner';

@Injectable({ providedIn: 'root' })
export class TrainControlTaskRunnerService implements ITaskRunner<ControlSchemeBindingType.TrainControl> {
    public runTask(
        hub: IHub,
        task: PortCommandTask<ControlSchemeBindingType.TrainControl>,
    ): Observable<PortCommandExecutionStatus> {
        return hub.motors.setSpeed(
            task.portId,
            task.payload.speed,
            {
                power: task.payload.power,
                useProfile: mapUseProfile(task.payload)
            }
        );
    }
}
