import { SpeedTaskPayload } from '@app/store';
import { calculateSpeedPower } from '@app/shared-misc';

export function speedTaskPayloadHash(payload: SpeedTaskPayload): string {
  const { speed, power } = calculateSpeedPower(payload.speed, payload.brakeFactor, payload.power);
  return [payload.type, speed, power].join('_');
}
