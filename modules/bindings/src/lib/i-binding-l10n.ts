import { Observable } from 'rxjs';
import { ControlSchemeBindingType } from '@app/shared-misc';
import { ControlSchemeBinding, ControlSchemeBindingInputs, ControlSchemeInput, PortCommandTask } from '@app/store';

export interface IBindingL10n<T extends ControlSchemeBindingType> {
    buildTaskSummary(
        task: PortCommandTask<T>
    ): Observable<string>;

    getBindingInputName(
        actionType: keyof ControlSchemeBindingInputs<T>,
        binding: ControlSchemeBinding & { bindingType: T },
    ): Observable<string>;

    getControllerInputName(
        actionType: keyof ControlSchemeBindingInputs<T>,
        inputConfig: ControlSchemeInput
    ): Observable<string>;
}
