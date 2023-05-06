import { TaskExecutor } from '../task-executor';
import { PortCommandTask, PortCommandTaskType } from '../../../common';
import { IHub, MotorProfile, PortOperationCompletionInformation, PortOperationStartupInformation } from '@nvsukhanov/poweredup-api';

export class ServoExecutor extends TaskExecutor {
    protected handle(
        task: PortCommandTask,
        hub: IHub
    ): Promise<void> | null {
        if (task.taskType === PortCommandTaskType.Servo) {
            return hub.motor.goToAbsoluteDegree(
                task.portId,
                task.angle,
                task.speed,
                task.power,
                task.endState,
                MotorProfile.dontUseProfiles,
                PortOperationStartupInformation.executeImmediately,
                PortOperationCompletionInformation.noAction
            );
        }
        return null;
    }

}
