import { TrainControlTaskPayload } from '../../../models';

export function trainControlPayloadHash(
    payload: TrainControlTaskPayload
): string {
    return [
        payload.bindingType,
        payload.speedIndex,
        payload.isLooping,
        payload.speed
    ].join('_');
}
