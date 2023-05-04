import { PortCommandTaskType } from '../../../common';
import { BaseTaskTypeCompressor } from './base-task-type-compressor';

export class SetSpeedTaskQueueCompressor extends BaseTaskTypeCompressor {
    protected taskType = PortCommandTaskType.SetSpeed;
}
