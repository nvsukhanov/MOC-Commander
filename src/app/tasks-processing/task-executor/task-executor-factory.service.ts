import { Injectable } from '@angular/core';
import { ITaskExecutor } from './i-task-executor';
import { ServoExecutor, SetSpeedExecutor } from './executors';

@Injectable({ providedIn: 'root' })
export class TaskExecutorFactoryService {
    public create(): ITaskExecutor {
        return this.createChain();
    }

    private createChain(): ITaskExecutor {
        const setSpeedExecutor = new SetSpeedExecutor();
        const servoExecutor = new ServoExecutor();
        setSpeedExecutor.setNext(servoExecutor);
        return setSpeedExecutor;
    }
}
