import { SetLinearSpeedTaskPayload } from '../../../models';

export function setSpeedPayloadHash(
    payload: SetLinearSpeedTaskPayload
): string {
    return [
        payload.bindingType,
        payload.speed,
        payload.power,
    ].join('_');
}
