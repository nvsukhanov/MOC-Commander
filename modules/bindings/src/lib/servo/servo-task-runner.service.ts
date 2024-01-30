import { IHub, PortCommandExecutionStatus } from 'rxpoweredup';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { ControlSchemeBindingType } from '@app/shared-misc';
import { PortCommandTask } from '@app/store';

import { IBindingTaskRunner } from '../i-binding-task-runner';
import { mapUseProfile } from '../common';

@Injectable()
export class ServoTaskRunnerService implements IBindingTaskRunner<ControlSchemeBindingType.Servo> {
    public runTask(
        hub: IHub,
        task: PortCommandTask<ControlSchemeBindingType.Servo>,
    ): Observable<PortCommandExecutionStatus> {
        return hub.motors.goToPosition(
            task.portId,
            task.payload.angle,
            {
                speed: task.payload.speed,
                power: task.payload.power,
                useProfile: mapUseProfile(task.payload)
            }
        );
    }
}
