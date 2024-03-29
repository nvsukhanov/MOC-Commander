import { Observable } from 'rxjs';
import { ControlSchemeBindingType } from '@app/shared-misc';
import { ControlSchemeBinding, ControlSchemeBindingInputs, ControlSchemeInputConfig, PortCommandTask } from '@app/store';

export interface IBindingL10n<T extends ControlSchemeBindingType> {
    readonly bindingTypeL10nKey: string;

    buildTaskSummary(
        task: PortCommandTask<T>
    ): Observable<string>;

    getBindingInputName(
        actionType: keyof ControlSchemeBindingInputs<T>,
        binding: ControlSchemeBinding & { bindingType: T },
    ): Observable<string>;

    getControllerInputName(
        actionType: keyof ControlSchemeBindingInputs<T>,
        inputConfig: ControlSchemeInputConfig
    ): Observable<string>;
}
