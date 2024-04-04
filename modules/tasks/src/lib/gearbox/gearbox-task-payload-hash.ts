import { GearboxTaskPayload } from '@app/store';

export function gearboxTaskPayloadHash(
    payload: GearboxTaskPayload
): string {
    return [
        payload.type,
        payload.angleIndex,
        payload.isLooping,
        payload.angle
    ].join('_');
}
