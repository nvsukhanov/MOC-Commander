import { SpeedStepperTaskPayload } from '../../../models';

export function speedStepperPayloadHash(
    payload: SpeedStepperTaskPayload
): string {
    return [
        payload.bindingType,
        payload.level,
        payload.nextSpeedActiveInput,
        payload.prevSpeedActiveInput
    ].join('_');
}
