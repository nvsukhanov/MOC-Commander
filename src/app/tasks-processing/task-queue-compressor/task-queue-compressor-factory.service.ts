import { Injectable } from '@angular/core';

import { PortCommandTaskType } from '@app/shared';
import { TaskQueueCompressor } from './task-queue-compressor';
import { BaseTaskTypeCompressor } from './compressors';

@Injectable({ providedIn: 'root' })
export class TaskQueueCompressorFactoryService {
    public create(): TaskQueueCompressor {
        return new TaskQueueCompressor([
            new BaseTaskTypeCompressor(PortCommandTaskType.SetSpeed),
            new BaseTaskTypeCompressor(PortCommandTaskType.Servo),
            new BaseTaskTypeCompressor(PortCommandTaskType.SetAngle),
        ]);
    }
}
