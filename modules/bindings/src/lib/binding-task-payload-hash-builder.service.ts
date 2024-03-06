import { Injectable } from '@angular/core';
import { PortCommandTaskPayload } from '@app/store';
import { ControlSchemeBindingType } from '@app/shared-misc';

import { servoBindingPayloadHash } from './servo';
import { setAngleBindingPayloadHash } from './set-angle';
import { speedBindingPayloadHash } from './speed';
import { stepperBindingPayloadHash } from './stepper';
import { trainBindingPayloadHash } from './train';
import { gearboxBindingPayloadHash } from './gearbox';

@Injectable()
export class BindingTaskPayloadHashBuilderService {
    public buildHash(
        payload: PortCommandTaskPayload
    ): string {
        switch (payload.bindingType) {
            case ControlSchemeBindingType.Servo:
                return servoBindingPayloadHash(payload);
            case ControlSchemeBindingType.SetAngle:
                return setAngleBindingPayloadHash(payload);
            case ControlSchemeBindingType.Speed:
                return speedBindingPayloadHash(payload);
            case ControlSchemeBindingType.Stepper:
                return stepperBindingPayloadHash(payload);
            case ControlSchemeBindingType.Train:
                return trainBindingPayloadHash(payload);
            case ControlSchemeBindingType.Gearbox:
                return gearboxBindingPayloadHash(payload);
        }
    }
}
