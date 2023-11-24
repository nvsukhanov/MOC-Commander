import { IHub, PortCommandExecutionStatus } from 'rxpoweredup';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { ControlSchemeBindingType } from '@app/shared-misc';

import { PortCommandTask } from '../../../../models';
import { mapUseProfile } from '../map-use-profile';
import { ITaskRunner } from '../i-task-runner';
import { calculateSpeedPower } from '../../calculate-speed-power';

@Injectable({ providedIn: 'root' })
export class SetSpeedTaskRunnerService implements ITaskRunner<ControlSchemeBindingType.SetSpeed> {
    public runTask(
        hub: IHub,
        task: PortCommandTask<ControlSchemeBindingType.SetSpeed>,
    ): Observable<PortCommandExecutionStatus> {
        const { speed, power } = calculateSpeedPower(task.payload.speed, task.payload.brakeFactor, task.payload.power);
        return hub.motors.setSpeed(
            task.portId,
            speed,
            {
                power,
                useProfile: mapUseProfile(task.payload)
            }
        );
    }
}
