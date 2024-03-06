import { ServoTaskPayload } from '@app/store';

export function servoBindingPayloadHash(
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
