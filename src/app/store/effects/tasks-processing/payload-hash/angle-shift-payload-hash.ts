import { AngleShiftTaskPayload } from '@app/store';

export function angleShiftPayloadHash(
    payload: AngleShiftTaskPayload
): string {
    return [
        payload.bindingType,
        payload.angleIndex,
        payload.nextAngleActiveInput,
        payload.prevAngleActiveInput,
    ].join('_');
}
