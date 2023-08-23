import { ServoTaskPayload } from '../../../models';

export function servoPayloadHash(
    payload: ServoTaskPayload
): string {
    return [
        payload.bindingType,
        payload.angle,
        payload.speed,
        payload.power,
        payload.endState
    ].join('_');
}
