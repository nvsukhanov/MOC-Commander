import { SetSpeedTaskPayload } from '@app/store';

export function setSpeedPayloadHash(
    payload: SetSpeedTaskPayload
): string {
    return [
        payload.bindingType,
        payload.speed,
        payload.power,
        payload.brakeFactor
    ].join('_');
}
