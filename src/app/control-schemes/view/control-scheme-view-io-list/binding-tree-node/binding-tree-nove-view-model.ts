import { ControllerInputType, HubIoOperationMode } from '@app/shared';

export type BindingTreeNodeRecord = {
    controllerId: string;
    isControllerConnected: boolean;
    inputId: string;
    inputType: ControllerInputType;
};

export type BindingTreeNodeViewModel = {
    isActive: boolean;
    ioHasNoRequiredCapabilities: boolean;
    operationMode: HubIoOperationMode;
    controlData: BindingTreeNodeRecord[];
};
