import { Injectable } from '@angular/core';
import { ITaskExecutor } from './i-task-executor';
import { ServoExecutor, SetSpeedExecutor } from './executors';

@Injectable({ providedIn: 'root' })
export class TaskExecutorFactoryService {
    public create(): ITaskExecutor {
        return new SetSpeedExecutor().setNext(
            new ServoExecutor()
        );
    }
}
