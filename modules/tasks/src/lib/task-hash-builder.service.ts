import { Injectable } from '@angular/core';
import { PortCommandTask, PortCommandTaskPayload, TaskType } from '@app/store';

import { setAngleTaskPayloadHash } from './set-angle';
import { speedTaskPayloadHash } from './speed';
import { stepperTaskPayloadHash } from './stepper';
import { trainTaskPayloadHash } from './train';
import { gearboxTaskPayloadHash } from './gearbox';

@Injectable()
export class TaskHashBuilderService {
    public calculateHash(
        task: PortCommandTask
    ): string {
        return `${task.hubId}/${task.portId}/${this.payloadHash(task.payload)}`;
    }

    private payloadHash(
        payload: PortCommandTaskPayload
    ): string {
        switch (payload.type) {
            case TaskType.SetAngle:
                return setAngleTaskPayloadHash(payload);
            case TaskType.Speed:
                return speedTaskPayloadHash(payload);
            case TaskType.Stepper:
                return stepperTaskPayloadHash(payload);
            case TaskType.Train:
                return trainTaskPayloadHash(payload);
            case TaskType.Gearbox:
                return gearboxTaskPayloadHash(payload);
        }
    }
}
