import { ITaskRunner } from '../i-task-runner';
import { ServoTaskRunner, SetAngleTaskRunner, SetSpeedTaskRunner, StepperTaskRunner } from './runners';
import { SpeedStepperTaskRunner } from './runners/speed-stepper-task-runner';

export function taskRunnerFactory(): ITaskRunner {
    const setSpeedTaskRunner = new SetSpeedTaskRunner();
    const servoTaskRunner = new ServoTaskRunner();
    const setAngleTaskRunner = new SetAngleTaskRunner();
    const stepperTaskRunner = new StepperTaskRunner();
    const speedStepperTaskRunner = new SpeedStepperTaskRunner();
    setSpeedTaskRunner.setNext(servoTaskRunner)
                      .setNext(setAngleTaskRunner)
                      .setNext(stepperTaskRunner)
                      .setNext(speedStepperTaskRunner);
    return setSpeedTaskRunner;
}
