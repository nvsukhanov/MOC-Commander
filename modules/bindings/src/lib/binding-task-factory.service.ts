import { Injectable } from '@angular/core';
import { Dictionary } from '@ngrx/entity';
import { ControlSchemeBindingType } from '@app/shared-misc';
import { AttachedIoPropsModel, ControlSchemeBinding, ControllerInputModel, ITaskFactory, PortCommandTask, PortCommandTaskPayload } from '@app/store';

import { ServoTaskPayloadBuilderService } from './servo';
import { SetAngleTaskPayloadBuilderService } from './set-angle';
import { SetSpeedTaskPayloadBuilderService } from './set-speed';
import { TrainControlTaskPayloadBuilderService } from './train-control';
import { StepperTaskPayloadBuilderService } from './stepper';
import { GearboxControlTaskPayloadBuilderService } from './gearbox';
import { BindingTaskPayloadHashBuilderService } from './binding-task-payload-hash-builder.service';
import { ITaskPayloadBuilder } from './i-task-payload-factory';

@Injectable()
export class BindingTaskFactoryService implements ITaskFactory {
    private readonly taskPayloadBuilders: { [k in ControlSchemeBindingType]: ITaskPayloadBuilder<k> } = {
        [ControlSchemeBindingType.Servo]: this.servoTaskPayloadBuilder,
        [ControlSchemeBindingType.SetAngle]: this.setAngleTaskPayloadBuilder,
        [ControlSchemeBindingType.SetSpeed]: this.setSpeedTaskPayloadBuilder,
        [ControlSchemeBindingType.TrainControl]: this.trainControlTaskPayloadBuilder,
        [ControlSchemeBindingType.Stepper]: this.stepperTaskPayloadBuilder,
        [ControlSchemeBindingType.GearboxControl]: this.gearboxControlTaskPayloadBuilder,
    };

    constructor(
        private readonly servoTaskPayloadBuilder: ServoTaskPayloadBuilderService,
        private readonly setAngleTaskPayloadBuilder: SetAngleTaskPayloadBuilderService,
        private readonly setSpeedTaskPayloadBuilder: SetSpeedTaskPayloadBuilderService,
        private readonly trainControlTaskPayloadBuilder: TrainControlTaskPayloadBuilderService,
        private readonly stepperTaskPayloadBuilder: StepperTaskPayloadBuilderService,
        private readonly gearboxControlTaskPayloadBuilder: GearboxControlTaskPayloadBuilderService,
        private readonly hashBuilder: BindingTaskPayloadHashBuilderService
    ) {
    }

    public buildTask(
        binding: ControlSchemeBinding,
        inputsState: Dictionary<ControllerInputModel>,
        ioProps: Omit<AttachedIoPropsModel, 'hubId' | 'portId'> | null,
        lastExecutedTask: PortCommandTask | null
    ): PortCommandTask | null {
        const payload = this.buildPayload(binding, inputsState, ioProps, lastExecutedTask);
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
        ioProps: Omit<AttachedIoPropsModel, 'hubId' | 'portId'> | null,
        previousTask: PortCommandTask | null
    ): { payload: PortCommandTaskPayload; inputTimestamp: number } | null {
        const taskPayloadBuilder: ITaskPayloadBuilder<T> = this.taskPayloadBuilders[binding.bindingType];
        return taskPayloadBuilder.buildPayload(
            binding,
            inputsState,
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
        return `${hubId}/${portId}/${this.hashBuilder.buildHash(payload)}`;
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
