import { IHub, PortCommandExecutionStatus } from 'rxpoweredup';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { ControlSchemeBindingType } from '@app/shared';

import { PortCommandTask } from '../../../../models';
import { mapUseProfile } from '../map-use-profile';
import { ITaskRunner } from '../i-task-runner';

@Injectable({ providedIn: 'root' })
export class SpeedShiftTaskRunnerService implements ITaskRunner<ControlSchemeBindingType.SpeedShift> {
    public runTask(
        hub: IHub,
        task: PortCommandTask<ControlSchemeBindingType.SpeedShift>,
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
