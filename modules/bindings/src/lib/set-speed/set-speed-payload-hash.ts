import { SetSpeedTaskPayload } from '@app/store';
import { calculateSpeedPower } from '@app/shared-misc';

export function setSpeedPayloadHash(
    payload: SetSpeedTaskPayload
): string {
    const { speed, power } = calculateSpeedPower(payload.speed, payload.brakeFactor, payload.power);
    return [
        payload.bindingType,
        speed,
        power
    ].join('_');
}
