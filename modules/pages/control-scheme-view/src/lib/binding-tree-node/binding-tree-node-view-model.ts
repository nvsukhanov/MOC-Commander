import { ControlSchemeBinding } from '@app/store';

export type InputActionTreeNodeRecord<T extends ControlSchemeBinding = ControlSchemeBinding> = {
    action: keyof T['inputs'];
    isControllerConnected: boolean;
};

export type BindingTreeNodeViewModel<T extends ControlSchemeBinding = ControlSchemeBinding> = {
    schemeName: string;
    binding: T;
    ioHasNoRequiredCapabilities: boolean;
    controlData: Array<InputActionTreeNodeRecord<T>>;
    areAllControllersConnected: boolean;
};
