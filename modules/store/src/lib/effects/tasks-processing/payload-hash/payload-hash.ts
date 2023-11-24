import { ControlSchemeBindingType } from '@app/shared';

import { PortCommandTaskPayload } from '../../../models';
import { servoPayloadHash } from './servo-payload-hash';
import { setAnglePayloadHash } from './set-angle-payload-hash';
import { setSpeedPayloadHash } from './set-speed-payload-hash';
import { stepperPayloadHash } from './stepper-payload-hash';
import { trainControlPayloadHash } from './train-control-payload-hash';
import { gearboxControlPayloadHash } from './gearbox-control-payload-hash';

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
        case ControlSchemeBindingType.TrainControl:
            return trainControlPayloadHash(payload);
        case ControlSchemeBindingType.GearboxControl:
            return gearboxControlPayloadHash(payload);
    }
}
