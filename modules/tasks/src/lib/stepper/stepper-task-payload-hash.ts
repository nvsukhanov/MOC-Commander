import { StepperTaskPayload } from '@app/store';

export function stepperTaskPayloadHash(payload: StepperTaskPayload): string {
  return [payload.type, payload.degree, payload.speed, payload.power, payload.endState, payload.action].join('_');
}
