import { GearboxControlTaskPayload } from '@app/store';

export function gearboxControlPayloadHash(
    payload: GearboxControlTaskPayload
): string {
    return [
        payload.bindingType,
        payload.angleIndex,
        payload.isLooping,
        payload.angle
    ].join('_');
}
