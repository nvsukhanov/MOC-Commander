import { Injectable } from '@angular/core';

import { ITaskSuppressor } from './i-task-suppressor';
import { ServoTaskSuppressor, SetAngleTaskSuppressor, SetSpeedTaskSuppressor, StepperTaskSuppressor } from './suppressors';

@Injectable({ providedIn: 'root' })
export class TaskSuppressorFactory {
    public create(): ITaskSuppressor {
        return this.createChain();
    }

    private createChain(): ITaskSuppressor {
        const setSpeedSuppressor = new SetSpeedTaskSuppressor();
        const servoSuppressor = new ServoTaskSuppressor();
        const setAngleSuppressor = new SetAngleTaskSuppressor();
        const stepperTaskSuppressor = new StepperTaskSuppressor();
        setSpeedSuppressor.setNext(servoSuppressor)
                          .setNext(setAngleSuppressor)
                          .setNext(stepperTaskSuppressor);
        return setSpeedSuppressor;
    }
}
