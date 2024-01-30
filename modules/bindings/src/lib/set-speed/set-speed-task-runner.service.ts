import { IHub, PortCommandExecutionStatus } from 'rxpoweredup';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { ControlSchemeBindingType, calculateSpeedPower } from '@app/shared-misc';
import { PortCommandTask } from '@app/store';

import { mapUseProfile } from '../common';
import { IBindingTaskRunner } from '../i-binding-task-runner';

@Injectable()
export class SetSpeedTaskRunnerService implements IBindingTaskRunner<ControlSchemeBindingType.SetSpeed> {
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
