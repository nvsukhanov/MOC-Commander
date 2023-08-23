import { ControlSchemeBindingType } from '@app/shared';

import { PortCommandTaskPayload } from '../../../models';
import { servoPayloadHash } from './servo-payload-hash';
import { setAnglePayloadHash } from './set-angle-payload-hash';
import { setSpeedPayloadHash } from './set-speed-payload-hash';
import { stepperPayloadHash } from './stepper-payload-hash';
import { speedShiftPayloadHash } from './speed-shift-payload-hash';

export function payloadHash(
    payload: PortCommandTaskPayload
): string {
    switch (payload.bindingType) {
        case ControlSchemeBindingType.Servo:
            return servoPayloadHash(payload);
        case ControlSchemeBindingType.SetAngle:
            return setAnglePayloadHash(payload);
        case ControlSchemeBindingType.SetSpeed:
            return setSpeedPayloadHash(payload);
        case ControlSchemeBindingType.Stepper:
            return stepperPayloadHash(payload);
        case ControlSchemeBindingType.SpeedShift:
            return speedShiftPayloadHash(payload);
    }
}
