import { GearboxTaskPayload } from '@app/store';

export function gearboxBindingPayloadHash(
    payload: GearboxTaskPayload
): string {
    return [
        payload.bindingType,
        payload.angleIndex,
        payload.isLooping,
        payload.angle
    ].join('_');
}
