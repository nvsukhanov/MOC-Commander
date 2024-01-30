import { Dictionary } from '@ngrx/entity';
import { ControlSchemeBindingType } from '@app/shared-misc';
import { AttachedIoPropsModel, ControlSchemeBinding, ControllerInputModel, PortCommandTask, PortCommandTaskPayload } from '@app/store';

export interface ITaskPayloadBuilder<TBindingType extends ControlSchemeBindingType> {
    buildPayload(
        binding: ControlSchemeBinding & { bindingType: TBindingType },
        inputsState: Dictionary<ControllerInputModel>,
        ioProps: Omit<AttachedIoPropsModel, 'hubId' | 'portId'> | null,
        previousTaskPayload: PortCommandTask | null
    ): { payload: PortCommandTaskPayload & { bindingType: TBindingType }; inputTimestamp: number } | null;

    buildCleanupPayload(
        previousTask: PortCommandTask
    ): PortCommandTaskPayload | null;
}
