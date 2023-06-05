import { Injectable } from '@angular/core';
import { ITaskSuppressor } from './i-task-suppressor';
import { ServoTaskSuppressor, SetAngleTaskSuppressor, SetSpeedTaskSuppressor } from './suppressors';

@Injectable({ providedIn: 'root' })
export class TaskSuppressorFactory {
    public create(): ITaskSuppressor {
        return this.createChain();
    }

    private createChain(): ITaskSuppressor {
        const setSpeedSuppressor = new SetSpeedTaskSuppressor();
        const servoSuppressor = new ServoTaskSuppressor();
        const setAngleSuppressor = new SetAngleTaskSuppressor();
        setSpeedSuppressor.setNext(servoSuppressor)
                          .setNext(setAngleSuppressor);
        return setSpeedSuppressor;
    }
}
