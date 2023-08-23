import { IHub, PortCommandExecutionStatus } from '@nvsukhanov/rxpoweredup';
import { Observable, last } from 'rxjs';
import { ControlSchemeBindingType } from '@app/shared';

import { TaskRunner } from '../task-runner';
import { PortCommandTask } from '../../../../models';
import { mapUseProfile } from '../map-use-profile';

export class StepperTaskRunner extends TaskRunner {
    protected handle(
        task: PortCommandTask,
        hub: IHub
    ): Observable<PortCommandExecutionStatus> | null {
        if (task.payload.bindingType === ControlSchemeBindingType.Stepper) {
            return hub.motors.rotateByDegree(
                task.portId,
                task.payload.degree,
                {
                    speed: task.payload.speed,
                    power: task.payload.power,
                    useProfile: mapUseProfile(task.payload),
                    endState: task.payload.endState
                }
            ).pipe(
                last()
            );
        }
        return null;
    }
}
