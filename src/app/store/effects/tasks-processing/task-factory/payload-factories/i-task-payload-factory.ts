import { Dictionary } from '@ngrx/entity';
import { Observable } from 'rxjs';
import { ControlSchemeBinding, ControllerInputModel, PortCommandTask, PortCommandTaskPayload } from '@app/store';
import { ControlSchemeBindingType } from '@app/shared';

export interface ITaskPayloadFactory<TBindingType extends ControlSchemeBindingType> {
    buildPayload(
        binding: ControlSchemeBinding & { operationMode: TBindingType },
        inputsState: Dictionary<ControllerInputModel>,
        motorEncoderOffset: number,
        previousTaskPayload: PortCommandTask | null
    ): Observable<{ payload: PortCommandTaskPayload & { bindingType: TBindingType }; inputTimestamp: number } | null>;

    buildCleanupPayload(
        previousTask: PortCommandTask
    ): Observable<PortCommandTaskPayload | null>;
}
