import { Injectable } from '@angular/core';
import { ITaskSuppressor } from './i-task-suppressor';
import { ServoTaskSuppressor, SetSpeedTaskSuppressor } from './suppressors';

@Injectable({ providedIn: 'root' })
export class TaskSuppressorFactory {
    public create(): ITaskSuppressor {
        return new SetSpeedTaskSuppressor().setNext(
            new ServoTaskSuppressor()
        );
    }
}
