import { SpeedShiftTaskPayload } from '../../../models';

export function speedShiftPayloadHash(
    payload: SpeedShiftTaskPayload
): string {
    return [
        payload.bindingType,
        payload.speedIndex,
        payload.nextSpeedActiveInput,
        payload.prevSpeedActiveInput
    ].join('_');
}
