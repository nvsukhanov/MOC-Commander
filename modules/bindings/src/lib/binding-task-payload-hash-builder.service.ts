import { Injectable } from '@angular/core';
import { PortCommandTaskPayload } from '@app/store';
import { ControlSchemeBindingType } from '@app/shared-misc';

import { servoPayloadHash } from './servo';
import { setAnglePayloadHash } from './set-angle';
import { setSpeedPayloadHash } from './set-speed';
import { stepperPayloadHash } from './stepper';
import { trainControlPayloadHash } from './train-control';
import { gearboxControlPayloadHash } from './gearbox';

@Injectable()
export class BindingTaskPayloadHashBuilderService {
    public buildHash(
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
}
