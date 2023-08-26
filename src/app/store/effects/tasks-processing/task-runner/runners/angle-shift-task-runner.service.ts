import { Injectable } from '@angular/core';
import { IHub, PortCommandExecutionStatus } from '@nvsukhanov/rxpoweredup';
import { Observable, first, of } from 'rxjs';
import { ControlSchemeBindingType } from '@app/shared';
import { PortCommandTask } from '@app/store';

import { ITaskRunner } from '../i-task-runner';
import { mapUseProfile } from '../map-use-profile';

@Injectable({ providedIn: 'root' })
export class AngleShiftTaskRunnerService implements ITaskRunner<ControlSchemeBindingType.AngleShift> {
    public runTask(
        hub: IHub,
        task: PortCommandTask<ControlSchemeBindingType.AngleShift>,
        prevTask?: PortCommandTask
    ): Observable<PortCommandExecutionStatus> {
        if (this.isTaskAlreadyExecuted(task, prevTask)) {
            return of(PortCommandExecutionStatus.inProgress);
        }
        return hub.motors.goToPosition(
            task.portId,
            task.payload.angle + task.payload.offset,
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

    // Task duplication check. If the task is already executed, we don't need to execute it again.
    // Duplication happens because of storing task state data in the task payload (e.g. 'nextAngleActiveInput').
    // (when input changes to zero we need to store that fact somewhere in order to restore it when input changes back to non-zero value)
    // This is definitely a bad practice, but it's much simpler to implement.
    // To avoid this, we need to store task state data in the separate store (e.g. in the task state store). This is a significantly more complex solution.
    // TODO: separate task state data from task payload.
    private isTaskAlreadyExecuted(
        task: PortCommandTask<ControlSchemeBindingType.AngleShift>,
        prevTask?: PortCommandTask
    ): boolean {
        return !!prevTask
            && prevTask.payload.bindingType === ControlSchemeBindingType.AngleShift
            && prevTask.portId === task.portId
            && prevTask.payload.angle === task.payload.angle
            && prevTask.payload.offset === task.payload.offset
            && prevTask.payload.angleIndex === task.payload.angleIndex
            && prevTask.payload.speed === task.payload.speed
            && prevTask.payload.power === task.payload.power
            && prevTask.payload.endState === task.payload.endState
            && prevTask.payload.useAccelerationProfile === task.payload.useAccelerationProfile
            && mapUseProfile(prevTask.payload) === mapUseProfile(task.payload);
    }
}
