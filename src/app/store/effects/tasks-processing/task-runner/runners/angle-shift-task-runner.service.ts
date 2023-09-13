import { Injectable } from '@angular/core';
import { IHub, PortCommandExecutionStatus } from 'rxpoweredup';
import { Observable, first } from 'rxjs';
import { ControlSchemeBindingType } from '@app/shared';
import { PortCommandTask } from '@app/store';

import { ITaskRunner } from '../i-task-runner';
import { mapUseProfile } from '../map-use-profile';

@Injectable({ providedIn: 'root' })
export class AngleShiftTaskRunnerService implements ITaskRunner<ControlSchemeBindingType.AngleShift> {
    public runTask(
        hub: IHub,
        task: PortCommandTask<ControlSchemeBindingType.AngleShift>
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
