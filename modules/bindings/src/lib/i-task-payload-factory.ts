import { ControlSchemeBindingType } from '@app/shared-misc';
import { AttachedIoPropsModel, ControlSchemeBinding, PortCommandTask, PortCommandTaskPayload } from '@app/store';

import { BindingInputExtractionResult } from './i-binding-task-input-extractor';

export interface ITaskPayloadBuilder<TBindingType extends ControlSchemeBindingType> {
    buildPayload(
        binding: ControlSchemeBinding & { bindingType: TBindingType },
        currentInput: BindingInputExtractionResult<TBindingType>,
        previousInput: BindingInputExtractionResult<TBindingType>,
        ioProps: Omit<AttachedIoPropsModel, 'hubId' | 'portId'> | null,
        previousTaskPayload: PortCommandTask | null
    ): { payload: PortCommandTaskPayload & { bindingType: TBindingType }; inputTimestamp: number } | null;

    buildCleanupPayload(
        previousTask: PortCommandTask
    ): PortCommandTaskPayload | null;
}
