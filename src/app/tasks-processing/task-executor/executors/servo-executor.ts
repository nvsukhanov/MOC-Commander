import { TaskExecutor } from '../task-executor';
import { PortCommandTask, PortCommandTaskType } from '../../../common';
import { Hub, MotorProfile, PortOperationCompletionInformation, PortOperationStartupInformation } from '../../../lego-hub';

export class ServoExecutor extends TaskExecutor {
    protected handle(
        task: PortCommandTask,
        hub: Hub
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
