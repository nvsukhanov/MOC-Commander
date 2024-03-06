import { Observable } from 'rxjs';
import { IHub, PortCommandExecutionStatus } from 'rxpoweredup';
import { Injectable } from '@angular/core';
import { ControlSchemeBindingType } from '@app/shared-misc';
import { PortCommandTask } from '@app/store';

import { mapUseProfile } from '../common';
import { IBindingTaskRunner } from '../i-binding-task-runner';

@Injectable()
export class SetAngleBindingTaskRunnerService implements IBindingTaskRunner<ControlSchemeBindingType.SetAngle> {
    public runTask(
        hub: IHub,
        task: PortCommandTask<ControlSchemeBindingType.SetAngle>,
    ): Observable<PortCommandExecutionStatus> {
        return hub.motors.goToPosition(
            task.portId,
            task.payload.angle,
            {
                speed: task.payload.speed,
                power: task.payload.power,
                endState: task.payload.endState,
                useProfile: mapUseProfile(task.payload)
            }
        );
    }
}
