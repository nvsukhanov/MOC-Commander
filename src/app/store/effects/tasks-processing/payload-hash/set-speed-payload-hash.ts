import { SetLinearSpeedTaskPayload } from '../../../models';

export function setSpeedPayloadHash(
    payload: SetLinearSpeedTaskPayload
): string {
    return [
        payload.taskType,
        payload.speed,
        payload.power,
    ].join('_');
}
