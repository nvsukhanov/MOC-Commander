import { HubIoOperationMode } from '../../../store';
import { ControlSchemeBindingOutputControl } from '../binding-output';
import { ControlSchemeBindingInputControl } from '../binding-input';

export interface IOutputConfigurationRenderer<T extends HubIoOperationMode> {
    setOutputFormControl?<F extends ControlSchemeBindingOutputControl>(
        outputFormControl: F['controls']['operationMode']['value'] extends T ? F : never,
    ): void;

    setInputFormControl?(
        inputFormControl: ControlSchemeBindingInputControl,
    ): void;
}
