import { Injectable } from '@angular/core';

import { ITaskRunner } from './i-task-runner';
import { ServoTaskRunner, SetAngleTaskRunner, SetSpeedTaskRunner, StepperTaskRunner } from './runners';

@Injectable({ providedIn: 'root' })
export class TaskRunnerFactoryService {
    public create(): ITaskRunner {
        return this.createChain();
    }

    private createChain(): ITaskRunner {
        const setSpeedTaskRunner = new SetSpeedTaskRunner();
        const servoTaskRunner = new ServoTaskRunner();
        const setAngleTaskRunner = new SetAngleTaskRunner();
        const stepperTaskRunner = new StepperTaskRunner();
        setSpeedTaskRunner.setNext(servoTaskRunner)
                          .setNext(setAngleTaskRunner)
                          .setNext(stepperTaskRunner);
        return setSpeedTaskRunner;
    }
}
