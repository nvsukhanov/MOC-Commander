import { SetAngleTaskPayload } from '@app/store';

export function setAngleTaskPayloadHash(payload: SetAngleTaskPayload): string {
  return [payload.angle, payload.speed, payload.power, payload.endState].join('_');
}
