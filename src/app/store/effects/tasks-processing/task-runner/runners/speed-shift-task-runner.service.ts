import { IHub, PortCommandExecutionStatus } from '@nvsukhanov/rxpoweredup';
import { Observable, of } from 'rxjs';
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
        prevTask?: PortCommandTask
    ): Observable<PortCommandExecutionStatus> {
        if (this.isTaskAlreadyExecuted(task, prevTask)) {
            return of(PortCommandExecutionStatus.completed);
        }
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

    // see AngleShiftTaskRunnerService for details
    private isTaskAlreadyExecuted(
        task: PortCommandTask<ControlSchemeBindingType.SpeedShift>,
        prevTask?: PortCommandTask
    ): boolean {
        return !!prevTask
            && prevTask.payload.bindingType === ControlSchemeBindingType.SpeedShift
            && prevTask.portId === task.portId
            && prevTask.payload.speed === task.payload.speed
            && prevTask.payload.power === task.payload.power
            && mapUseProfile(prevTask.payload) === mapUseProfile(task.payload);
    }
}
