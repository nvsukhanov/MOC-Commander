import { StepperTaskPayload } from '../../../models';

export function stepperPayloadHash(
    payload: StepperTaskPayload
): string {
    return [
        payload.taskType,
        payload.degree,
        payload.speed,
        payload.power,
        payload.endState
    ].join('_');
}
