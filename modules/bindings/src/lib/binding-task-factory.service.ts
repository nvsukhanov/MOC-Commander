import { Injectable } from '@angular/core';
import { ControlSchemeBindingType } from '@app/shared-misc';
import { AttachedIoPropsModel, ControlSchemeBinding, ITaskFactory, PortCommandTask, PortCommandTaskPayload } from '@app/store';

import { ServoTaskPayloadBuilderService } from './servo';
import { SetAngleTaskPayloadBuilderService } from './set-angle';
import { SpeedTaskPayloadBuilderService } from './speed';
import { TrainControlTaskPayloadBuilderService } from './train-control';
import { StepperTaskPayloadBuilderService } from './stepper';
import { GearboxControlTaskPayloadBuilderService } from './gearbox';
import { BindingTaskPayloadHashBuilderService } from './binding-task-payload-hash-builder.service';
import { ITaskPayloadBuilder } from './i-task-payload-factory';
import { BindingInputExtractionResult } from './i-binding-task-input-extractor';
import { calculateTaskHash } from './common';

@Injectable()
export class BindingTaskFactoryService implements ITaskFactory {
    private readonly taskPayloadBuilders: { [k in ControlSchemeBindingType]: ITaskPayloadBuilder<k> } = {
        [ControlSchemeBindingType.Servo]: this.servoTaskPayloadBuilder,
        [ControlSchemeBindingType.SetAngle]: this.setAngleTaskPayloadBuilder,
        [ControlSchemeBindingType.Speed]: this.speedTaskPayloadBuilder,
        [ControlSchemeBindingType.TrainControl]: this.trainControlTaskPayloadBuilder,
        [ControlSchemeBindingType.Stepper]: this.stepperTaskPayloadBuilder,
        [ControlSchemeBindingType.GearboxControl]: this.gearboxControlTaskPayloadBuilder,
    };

    constructor(
        private readonly servoTaskPayloadBuilder: ServoTaskPayloadBuilderService,
        private readonly setAngleTaskPayloadBuilder: SetAngleTaskPayloadBuilderService,
        private readonly speedTaskPayloadBuilder: SpeedTaskPayloadBuilderService,
        private readonly trainControlTaskPayloadBuilder: TrainControlTaskPayloadBuilderService,
        private readonly stepperTaskPayloadBuilder: StepperTaskPayloadBuilderService,
        private readonly gearboxControlTaskPayloadBuilder: GearboxControlTaskPayloadBuilderService,
        private readonly hashBuilder: BindingTaskPayloadHashBuilderService
    ) {
    }

    public buildTask(
        binding: ControlSchemeBinding,
        currentInput: BindingInputExtractionResult<ControlSchemeBindingType>,
        prevInput: BindingInputExtractionResult<ControlSchemeBindingType>,
        ioProps: Omit<AttachedIoPropsModel, 'hubId' | 'portId'> | null,
        lastExecutedTask: PortCommandTask | null
    ): PortCommandTask | null {
        const payload = this.buildPayload(binding, currentInput, prevInput, ioProps, lastExecutedTask);
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
        currentInput: BindingInputExtractionResult<T>,
        prevInput: BindingInputExtractionResult<T>,
        ioProps: Omit<AttachedIoPropsModel, 'hubId' | 'portId'> | null,
        previousTask: PortCommandTask | null
    ): { payload: PortCommandTaskPayload; inputTimestamp: number } | null {
        const taskPayloadBuilder = this.taskPayloadBuilders[binding.bindingType] as ITaskPayloadBuilder<T>;
        return taskPayloadBuilder.buildPayload(
            binding,
            currentInput,
            prevInput,
            ioProps,
            previousTask
        );
    }

    private buildCleanupPayload(
        previousTask: PortCommandTask
    ): PortCommandTaskPayload | null {
        return this.taskPayloadBuilders[previousTask.payload.bindingType].buildCleanupPayload(previousTask);
    }

    private calculateHash(
        hubId: string,
        portId: number,
        payload: PortCommandTaskPayload
    ): string {
        return calculateTaskHash(hubId, portId, this.hashBuilder.buildHash(payload));
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
