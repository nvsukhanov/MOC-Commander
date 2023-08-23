import { IHub, PortCommandExecutionStatus } from '@nvsukhanov/rxpoweredup';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { ControlSchemeBindingType } from '@app/shared';

import { PortCommandTask } from '../../../../models';
import { mapUseProfile } from '../map-use-profile';
import { ITaskRunner } from '../i-task-runner';

@Injectable({ providedIn: 'root' })
export class SpeedShiftTaskRunnerService implements ITaskRunner<ControlSchemeBindingType.SpeedShift> {
    public runTask(
        task: PortCommandTask<ControlSchemeBindingType.SpeedShift>,
        hub: IHub
    ): Observable<PortCommandExecutionStatus> {
        return hub.motors.setSpeed(
            task.portId,
            task.payload.speed,
            {
                power: task.payload.power,
                useProfile: mapUseProfile(task.payload),
                noFeedback: true
            }
        );
    }
}
