import { SpeedShiftTaskPayload } from '../../../models';

export function speedShiftPayloadHash(
    payload: SpeedShiftTaskPayload
): string {
    return [
        payload.bindingType,
        payload.speedIndex,
        payload.isLooping,
        payload.speed
    ].join('_');
}
