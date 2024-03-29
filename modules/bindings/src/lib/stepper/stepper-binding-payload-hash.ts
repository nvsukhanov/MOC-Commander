import { StepperTaskPayload } from '@app/store';

export function stepperBindingPayloadHash(
    payload: StepperTaskPayload
): string {
    return [
        payload.bindingType,
        payload.degree,
        payload.speed,
        payload.power,
        payload.endState,
        payload.action
    ].join('_');
}
