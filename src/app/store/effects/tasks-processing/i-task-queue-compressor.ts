import { InjectionToken } from '@angular/core';

import { PortCommandTask } from '../../models';
import { queueCompressorFactory } from './task-queue-compressor';

export interface ITaskQueueCompressor {
    compress(queue: PortCommandTask[]): PortCommandTask[];
}

export const TASK_QUEUE_COMPRESSOR = new InjectionToken<ITaskQueueCompressor>('TASK QUEUE COMPRESSOR', { factory: queueCompressorFactory });
