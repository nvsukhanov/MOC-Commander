import { ControlSchemeBindingType } from '@app/shared-misc';
import {
  AttachedIoPropsModel,
  ControlSchemeBinding,
  PortCommandTask,
  PortCommandTaskPayload,
  TaskInputs,
} from '@app/store';

export interface ITaskPayloadBuilder<TBindingType extends ControlSchemeBindingType> {
  buildPayload(
    binding: ControlSchemeBinding & { bindingType: TBindingType },
    currentInput: TaskInputs<TBindingType>,
    previousInput: TaskInputs<TBindingType>,
    ioProps: Omit<AttachedIoPropsModel, 'hubId' | 'portId'> | null,
    previousTaskPayload: PortCommandTask | null,
  ): { payload: PortCommandTaskPayload; inputTimestamp: number } | null;

  buildCleanupPayload(previousTask: PortCommandTask): PortCommandTaskPayload | null;
}
