import { ControlSchemeBindingOutputForm } from '../binding-output';
import { ControlSchemeBindingInputForm } from '../binding-input';

export interface IOutputConfigurationRenderer {
    setOutputFormControl?(
        outputFormControl: ControlSchemeBindingOutputForm
    ): void;

    setInputFormControl?(
        inputFormControl: ControlSchemeBindingInputForm,
    ): void;
}
