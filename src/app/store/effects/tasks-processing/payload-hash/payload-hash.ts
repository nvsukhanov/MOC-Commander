import { ControlSchemeBindingType } from '@app/shared';

import { PortCommandTaskPayload } from '../../../models';
import { servoPayloadHash } from './servo-payload-hash';
import { setAnglePayloadHash } from './set-angle-payload-hash';
import { setSpeedPayloadHash } from './set-speed-payload-hash';
import { stepperPayloadHash } from './stepper-payload-hash';
import { speedStepperPayloadHash } from './speed-stepper-payload-hash';

export function payloadHash(
    payload: PortCommandTaskPayload
): string {
    switch (payload.bindingType) {
        case ControlSchemeBindingType.Servo:
            return servoPayloadHash(payload);
        case ControlSchemeBindingType.SetAngle:
            return setAnglePayloadHash(payload);
        case ControlSchemeBindingType.Linear:
            return setSpeedPayloadHash(payload);
        case ControlSchemeBindingType.Stepper:
            return stepperPayloadHash(payload);
        case ControlSchemeBindingType.SpeedStepper:
            return speedStepperPayloadHash(payload);
    }
}
