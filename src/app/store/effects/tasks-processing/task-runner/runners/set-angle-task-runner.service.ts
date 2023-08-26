import { Observable } from 'rxjs';
import { IHub, PortCommandExecutionStatus } from '@nvsukhanov/rxpoweredup';
import { Injectable } from '@angular/core';
import { ControlSchemeBindingType } from '@app/shared';

import { PortCommandTask } from '../../../../models';
import { mapUseProfile } from '../map-use-profile';
import { ITaskRunner } from '../i-task-runner';

@Injectable({ providedIn: 'root' })
export class SetAngleTaskRunnerService implements ITaskRunner<ControlSchemeBindingType.SetAngle> {
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
