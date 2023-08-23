import { SpeedStepperTaskPayload } from '@app/store';

export function speedStepperPayloadHash(
    payload: SpeedStepperTaskPayload
): string {
    return [
        payload.taskType,
        payload.level,
        payload.nextSpeedActiveInput,
        payload.prevSpeedActiveInput
    ].join('_');
}
