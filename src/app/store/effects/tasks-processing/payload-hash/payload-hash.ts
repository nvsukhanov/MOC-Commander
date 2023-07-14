import { PortCommandTaskPayload, PortCommandTaskType } from '../../../models';
import { servoPayloadHash } from './servo-payload-hash';
import { setAnglePayloadHash } from './set-angle-payload-hash';
import { setSpeedPayloadHash } from './set-speed-payload-hash';
import { stepperPayloadHash } from './stepper-payload-hash';

export function payloadHash(
    payload: PortCommandTaskPayload
): string {
    switch (payload.taskType) {
        case PortCommandTaskType.Servo:
            return servoPayloadHash(payload);
        case PortCommandTaskType.SetAngle:
            return setAnglePayloadHash(payload);
        case PortCommandTaskType.SetSpeed:
            return setSpeedPayloadHash(payload);
        case PortCommandTaskType.Stepper:
            return stepperPayloadHash(payload);
    }
}
