import { Injectable } from '@angular/core';
import { ControlSchemeBindingType } from '@app/shared-misc';
import {
  AttachedIoPropsModel,
  ControlSchemeBinding,
  ITaskFactory,
  PortCommandTask,
  PortCommandTaskPayload,
  TaskInputs,
} from '@app/store';

import { ServoBindingTaskPayloadBuilderService } from './servo';
import { SetAngleBindingTaskPayloadBuilderService } from './set-angle';
import { SpeedBindingTaskPayloadBuilderService } from './speed';
import { TrainBindingTaskPayloadBuilderService } from './train';
import { StepperBindingTaskPayloadBuilderService } from './stepper';
import { GearboxBindingTaskPayloadBuilderService } from './gearbox';
import { ITaskPayloadBuilder } from './i-task-payload-factory';
import { AccelerateBindingTaskPayloadBuilderService } from './accelerate';
import { PowerBindingTaskPayloadBuilderService } from './power';

@Injectable()
export class BindingTaskFactoryService implements ITaskFactory {
  private readonly taskPayloadBuilders: { [k in ControlSchemeBindingType]: ITaskPayloadBuilder<k> } = {
    [ControlSchemeBindingType.Servo]: this.servoTaskPayloadBuilder,
    [ControlSchemeBindingType.SetAngle]: this.setAngleTaskPayloadBuilder,
    [ControlSchemeBindingType.Speed]: this.speedTaskPayloadBuilder,
    [ControlSchemeBindingType.Train]: this.trainTaskPayloadBuilder,
    [ControlSchemeBindingType.Stepper]: this.stepperTaskPayloadBuilder,
    [ControlSchemeBindingType.Gearbox]: this.gearboxTaskPayloadBuilder,
    [ControlSchemeBindingType.Accelerate]: this.accelerateTaskPayloadBuilder,
    [ControlSchemeBindingType.Power]: this.powerTaskPayloadBuilder,
  };

  constructor(
    private readonly servoTaskPayloadBuilder: ServoBindingTaskPayloadBuilderService,
    private readonly setAngleTaskPayloadBuilder: SetAngleBindingTaskPayloadBuilderService,
    private readonly speedTaskPayloadBuilder: SpeedBindingTaskPayloadBuilderService,
    private readonly trainTaskPayloadBuilder: TrainBindingTaskPayloadBuilderService,
    private readonly stepperTaskPayloadBuilder: StepperBindingTaskPayloadBuilderService,
    private readonly gearboxTaskPayloadBuilder: GearboxBindingTaskPayloadBuilderService,
    private readonly accelerateTaskPayloadBuilder: AccelerateBindingTaskPayloadBuilderService,
    private readonly powerTaskPayloadBuilder: PowerBindingTaskPayloadBuilderService,
  ) {}

  public buildTask(
    binding: ControlSchemeBinding,
    currentInput: TaskInputs,
    prevInput: TaskInputs,
    ioProps: Omit<AttachedIoPropsModel, 'hubId' | 'portId'> | null,
    lastExecutedTask: PortCommandTask | null,
  ): PortCommandTask | null {
    const payload = this.buildPayload(binding, currentInput, prevInput, ioProps, lastExecutedTask);
    if (payload) {
      return this.composeTask(binding, payload.payload, payload.inputTimestamp);
    }
    return null;
  }

  public buildCleanupTask(previousTask: PortCommandTask): PortCommandTask | null {
    const payload = this.buildCleanupPayload(previousTask);
    if (payload) {
      return {
        ...previousTask,
        payload,
      };
    }
    return null;
  }

  private buildPayload<T extends ControlSchemeBindingType>(
    binding: ControlSchemeBinding & { bindingType: T },
    currentInput: TaskInputs<T>,
    prevInput: TaskInputs<T>,
    ioProps: Omit<AttachedIoPropsModel, 'hubId' | 'portId'> | null,
    previousTask: PortCommandTask | null,
  ): { payload: PortCommandTaskPayload; inputTimestamp: number } | null {
    const taskPayloadBuilder = this.taskPayloadBuilders[binding.bindingType] as ITaskPayloadBuilder<T>;
    return taskPayloadBuilder.buildPayload(binding, currentInput, prevInput, ioProps, previousTask);
  }

  private buildCleanupPayload(previousTask: PortCommandTask): PortCommandTaskPayload | null {
    return this.taskPayloadBuilders[previousTask.payload.type].buildCleanupPayload(previousTask);
  }

  private composeTask(
    binding: ControlSchemeBinding,
    payload: PortCommandTaskPayload,
    inputTimestamp: number,
  ): PortCommandTask {
    return {
      hubId: binding.hubId,
      portId: binding.portId,
      payload,
      inputTimestamp,
    };
  }
}
