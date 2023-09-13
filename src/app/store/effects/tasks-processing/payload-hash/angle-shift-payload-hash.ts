import { AngleShiftTaskPayload } from '@app/store';

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
