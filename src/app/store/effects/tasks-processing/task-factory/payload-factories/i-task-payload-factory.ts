import { Dictionary } from '@ngrx/entity';
import { ControlSchemeBinding, ControllerInputModel, PortCommandTask, PortCommandTaskPayload } from '@app/store';
import { ControlSchemeBindingType } from '@app/shared';

export interface ITaskPayloadFactory<TBindingType extends ControlSchemeBindingType> {
    buildPayload(
        binding: ControlSchemeBinding & { bindingType: TBindingType },
        inputsState: Dictionary<ControllerInputModel>,
        motorEncoderOffset: number,
        previousTaskPayload: PortCommandTask | null
    ): { payload: PortCommandTaskPayload & { bindingType: TBindingType }; inputTimestamp: number } | null;

    buildCleanupPayload(
        previousTask: PortCommandTask
    ): PortCommandTaskPayload | null;
}
