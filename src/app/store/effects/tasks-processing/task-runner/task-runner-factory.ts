import { ITaskRunner } from '../i-task-runner';
import { ServoTaskRunner, SetAngleTaskRunner, SetSpeedTaskRunner, StepperTaskRunner } from './runners';

export function taskRunnerFactory(): ITaskRunner {
    const setSpeedTaskRunner = new SetSpeedTaskRunner();
    const servoTaskRunner = new ServoTaskRunner();
    const setAngleTaskRunner = new SetAngleTaskRunner();
    const stepperTaskRunner = new StepperTaskRunner();
    setSpeedTaskRunner.setNext(servoTaskRunner)
                      .setNext(setAngleTaskRunner)
                      .setNext(stepperTaskRunner);
    return setSpeedTaskRunner;
}
