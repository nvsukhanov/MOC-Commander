import { ControlSchemeBindingType } from '@app/shared';

import { ITaskQueueCompressor } from '../i-task-queue-compressor';
import { ComposingTaskQueueCompressor } from './composing-task-queue-compressor';
import { LastOfTypeTaskCompressor } from './last-of-type-task-compressor';
import { StepperTaskCompressor } from './stepper-task-compressor';
import { SetSpeedQueueCompressor } from './set-speed-queue-compressor';

export function queueCompressorFactory(): ITaskQueueCompressor {
    return new ComposingTaskQueueCompressor([
        new LastOfTypeTaskCompressor(ControlSchemeBindingType.Servo),
        new LastOfTypeTaskCompressor(ControlSchemeBindingType.SetAngle),
        new StepperTaskCompressor(),
        new SetSpeedQueueCompressor(),
        new LastOfTypeTaskCompressor(ControlSchemeBindingType.SpeedShift),
        new LastOfTypeTaskCompressor(ControlSchemeBindingType.AngleShift)
    ]);
}
