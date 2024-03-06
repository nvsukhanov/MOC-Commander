import { Injectable } from '@angular/core';
import { PortCommandTaskPayload } from '@app/store';
import { ControlSchemeBindingType } from '@app/shared-misc';

import { servoPayloadHash } from './servo';
import { setAnglePayloadHash } from './set-angle';
import { speedPayloadHash } from './speed';
import { stepperPayloadHash } from './stepper';
import { trainBindingPayloadHash } from './train';
import { gearboxBindingPayloadHash } from './gearbox';

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
            case ControlSchemeBindingType.Speed:
                return speedPayloadHash(payload);
            case ControlSchemeBindingType.Stepper:
                return stepperPayloadHash(payload);
            case ControlSchemeBindingType.Train:
                return trainBindingPayloadHash(payload);
            case ControlSchemeBindingType.Gearbox:
                return gearboxBindingPayloadHash(payload);
        }
    }
}
