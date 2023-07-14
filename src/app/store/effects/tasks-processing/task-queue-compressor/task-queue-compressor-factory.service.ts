import { Injectable } from '@angular/core';

import { ComposingTaskQueueCompressor } from './composing-task-queue-compressor';
import { LastOfTypeTaskCompressor } from './last-of-type-task-compressor';
import { ITaskQueueCompressor } from './i-task-queue-compressor';
import { PortCommandTaskType } from '../../../models';
import { StepperTaskCompressor } from './stepper-task-compressor';

@Injectable({ providedIn: 'root' })
export class TaskQueueCompressorFactoryService {
    public create(): ITaskQueueCompressor {
        return new ComposingTaskQueueCompressor([
            new LastOfTypeTaskCompressor(PortCommandTaskType.SetSpeed),
            new LastOfTypeTaskCompressor(PortCommandTaskType.Servo),
            new LastOfTypeTaskCompressor(PortCommandTaskType.SetAngle),
            new StepperTaskCompressor(),
        ]);
    }
}
