import { PortCommandTaskType } from '../../../common';
import { BaseTaskTypeCompressor } from './base-task-type-compressor';

export class ServoTaskQueueCompressor extends BaseTaskTypeCompressor {
    protected taskType = PortCommandTaskType.Servo;
}
