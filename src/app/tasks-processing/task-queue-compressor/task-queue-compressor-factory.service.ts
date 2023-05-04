import { Injectable } from '@angular/core';
import { TaskQueueCompressor } from './task-queue-compressor';
import { ServoTaskQueueCompressor, SetSpeedTaskQueueCompressor } from './compressors';

@Injectable({ providedIn: 'root' })
export class TaskQueueCompressorFactoryService {
    public create(): TaskQueueCompressor {
        return new TaskQueueCompressor([
            new SetSpeedTaskQueueCompressor(),
            new ServoTaskQueueCompressor()
        ]);
    }
}
