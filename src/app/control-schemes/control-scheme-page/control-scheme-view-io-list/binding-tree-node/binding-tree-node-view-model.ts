import { ControlSchemeBindingType } from '@app/shared';
import { ControlSchemeInput, ControlSchemeInputAction } from '@app/store';

export type BindingTreeNodeRecord = {
    action: ControlSchemeInputAction;
    input: ControlSchemeInput;
    isControllerConnected: boolean;
};

export type BindingTreeNodeViewModel = {
    controlSchemeId: string;
    bindingId: string;
    isActive: boolean;
    ioHasNoRequiredCapabilities: boolean;
    operationMode: ControlSchemeBindingType;
    controlData: BindingTreeNodeRecord[];
};
