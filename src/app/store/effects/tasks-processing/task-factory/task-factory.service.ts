import { Injectable } from '@angular/core';
import { Dictionary } from '@ngrx/entity';
import { ControlSchemeBindingType } from '@app/shared';

import { ControlSchemeBinding, ControllerInputModel, PortCommandTask, PortCommandTaskPayload } from '../../../models';
import {
    AngleShiftTaskPayloadFactoryService,
    ITaskPayloadFactory,
    ServoTaskPayloadFactoryService,
    SetAngleTaskPayloadFactoryService,
    SetSpeedTaskPayloadFactoryService,
    SpeedShiftTaskPayloadFactoryService,
    StepperTaskPayloadFactoryService
} from './payload-factories';
import { payloadHash } from '../payload-hash';

@Injectable({ providedIn: 'root' })
export class TaskFactoryService {
    private readonly taskPayloadFactories: { [k in ControlSchemeBindingType]: ITaskPayloadFactory<k> } = {
        [ControlSchemeBindingType.Servo]: this.servoTaskPayloadFactory,
        [ControlSchemeBindingType.SetAngle]: this.setAngleTaskPayloadFactory,
        [ControlSchemeBindingType.SetSpeed]: this.setSpeedTaskPayloadFactory,
        [ControlSchemeBindingType.SpeedShift]: this.speedShiftTaskPayloadFactory,
        [ControlSchemeBindingType.Stepper]: this.stepperTaskPayloadFactory,
        [ControlSchemeBindingType.AngleShift]: this.angleShiftTaskPayloadFactory,
    };

    constructor(
        private readonly servoTaskPayloadFactory: ServoTaskPayloadFactoryService,
        private readonly setAngleTaskPayloadFactory: SetAngleTaskPayloadFactoryService,
        private readonly setSpeedTaskPayloadFactory: SetSpeedTaskPayloadFactoryService,
        private readonly speedShiftTaskPayloadFactory: SpeedShiftTaskPayloadFactoryService,
        private readonly stepperTaskPayloadFactory: StepperTaskPayloadFactoryService,
        private readonly angleShiftTaskPayloadFactory: AngleShiftTaskPayloadFactoryService
    ) {
    }

    public buildTask(
        binding: ControlSchemeBinding,
        inputsState: Dictionary<ControllerInputModel>,
        motorEncoderOffset: number,
        lastExecutedTask: PortCommandTask | null
    ): PortCommandTask | null {
        const payload = this.buildPayload(binding, inputsState, motorEncoderOffset, lastExecutedTask);
        if (payload) {
            return this.composeTask(binding, payload.payload, payload.inputTimestamp);
        }
        return null;
    }

    public buildCleanupTask(
        previousTask: PortCommandTask
    ): PortCommandTask | null {
        const payload = this.buildCleanupPayload(previousTask);
        if (payload) {
            return {
                ...previousTask,
                payload,
                hash: this.calculateHash(previousTask.hubId, previousTask.portId, payload)
            };
        }
        return null;
    }

    private buildPayload<T extends ControlSchemeBindingType>(
        binding: ControlSchemeBinding & { bindingType: T },
        inputsState: Dictionary<ControllerInputModel>,
        motorEncoderOffset: number,
        previousTask: PortCommandTask | null
    ): { payload: PortCommandTaskPayload; inputTimestamp: number } | null {
        const taskPayloadFactory: ITaskPayloadFactory<T> = this.taskPayloadFactories[binding.bindingType];
        return taskPayloadFactory.buildPayload(
            binding,
            inputsState,
            motorEncoderOffset,
            previousTask
        );
    }

    private buildCleanupPayload(
        previousTask: PortCommandTask
    ): PortCommandTaskPayload | null {
        return this.taskPayloadFactories[previousTask.payload.bindingType].buildCleanupPayload(previousTask);
    }

    private calculateHash(
        hubId: string,
        portId: number,
        payload: PortCommandTaskPayload
    ): string {
        return `${hubId}/${portId}/${payloadHash(payload)}`;
    }

    private composeTask(
        binding: ControlSchemeBinding,
        payload: PortCommandTaskPayload,
        inputTimestamp: number
    ): PortCommandTask {
        return {
            hubId: binding.hubId,
            portId: binding.portId,
            payload,
            hash: this.calculateHash(binding.hubId, binding.portId, payload),
            inputTimestamp
        };
    }
}
