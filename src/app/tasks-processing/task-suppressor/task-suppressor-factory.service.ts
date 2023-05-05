import { Injectable } from '@angular/core';
import { ITaskSuppressor } from './i-task-suppressor';
import { ServoTaskSuppressor, SetSpeedTaskSuppressor } from './suppressors';

@Injectable({ providedIn: 'root' })
export class TaskSuppressorFactory {
    public create(): ITaskSuppressor {
        return this.createChain();
    }

    private createChain(): ITaskSuppressor {
        const setSpeedSuppressor = new SetSpeedTaskSuppressor();
        const servoSuppressor = new ServoTaskSuppressor();
        setSpeedSuppressor.setNext(servoSuppressor);
        return setSpeedSuppressor;
    }
}
