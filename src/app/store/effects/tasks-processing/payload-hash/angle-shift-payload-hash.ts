import { AngleShiftTaskPayload } from '../../../models';

export function angleShiftPayloadHash(
    payload: AngleShiftTaskPayload
): string {
    return [
        payload.bindingType,
        payload.angleIndex,
        payload.isLooping,
        payload.angle
    ].join('_');
}
