import { TrainTaskPayload } from '@app/store';

export function trainTaskPayloadHash(
    payload: TrainTaskPayload
): string {
    return [
        payload.type,
        payload.speedIndex,
        payload.isLooping,
        payload.speed
    ].join('_');
}
