import { TrainTaskPayload } from '@app/store';

export function trainBindingPayloadHash(
    payload: TrainTaskPayload
): string {
    return [
        payload.bindingType,
        payload.speedIndex,
        payload.isLooping,
        payload.speed
    ].join('_');
}
