import { SpeedShiftTaskPayload } from '../../../models';

export function speedShiftPayloadHash(
    payload: SpeedShiftTaskPayload
): string {
    return [
        payload.bindingType,
        payload.level,
        payload.nextSpeedActiveInput,
        payload.prevSpeedActiveInput
    ].join('_');
}
