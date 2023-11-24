import { GearboxControlTaskPayload } from '../../../models';

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
