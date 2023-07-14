import { ServoTaskPayload } from '../../../models';

export function servoPayloadHash(
    payload: ServoTaskPayload
): string {
    return [
        payload.taskType,
        payload.angle,
        payload.speed,
        payload.power,
        payload.endState
    ].join('_');
}
