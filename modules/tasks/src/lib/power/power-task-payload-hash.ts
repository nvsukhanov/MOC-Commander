import { PowerTaskPayload } from '@app/store';
import { clampSpeed } from '@app/shared-misc';

export function powerTaskPayloadHash(payload: PowerTaskPayload): string {
  const power = clampSpeed(payload.power);
  return `${payload.type}_${power}`;
}
