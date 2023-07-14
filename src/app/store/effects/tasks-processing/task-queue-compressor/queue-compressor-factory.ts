import { ITaskQueueCompressor } from '../i-task-queue-compressor';
import { ComposingTaskQueueCompressor } from './composing-task-queue-compressor';
import { LastOfTypeTaskCompressor } from './last-of-type-task-compressor';
import { PortCommandTaskType } from '../../../models';
import { StepperTaskCompressor } from './stepper-task-compressor';

export function queueCompressorFactory(): ITaskQueueCompressor {
    return new ComposingTaskQueueCompressor([
        new LastOfTypeTaskCompressor(PortCommandTaskType.SetSpeed),
        new LastOfTypeTaskCompressor(PortCommandTaskType.Servo),
        new LastOfTypeTaskCompressor(PortCommandTaskType.SetAngle),
        new StepperTaskCompressor(),
    ]);
}
