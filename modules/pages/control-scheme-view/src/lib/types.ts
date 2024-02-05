import { ControlSchemeBinding } from '@app/store';

export enum ControlSchemeNodeTypes {
    Hub = 'Hub',
    Io = 'Io',
    Binding = 'Binding',
}

export type ControlSchemeViewBindingTreeNodeData = {
    path: string;
    nodeType: ControlSchemeNodeTypes.Binding;
    schemeName: string;
    binding: ControlSchemeBinding;
    ioHasNoRequiredCapabilities: boolean;
    children: [];
};

export type ControlSchemeViewIoTreeNode = {
    path: string;
    nodeType: ControlSchemeNodeTypes.Io;
    schemeName: string;
    bindings: ControlSchemeBinding[];
    hubId: string;
    portId: number;
    children: ControlSchemeViewBindingTreeNodeData[];
};

export type ControlSchemeViewHubTreeNode = {
    path: string;
    nodeType: ControlSchemeNodeTypes.Hub;
    hubId: string;
    name: string;
    children: ControlSchemeViewIoTreeNode[];
};

export type ControlSchemeViewTreeNode = ControlSchemeViewHubTreeNode
    | ControlSchemeViewIoTreeNode
    | ControlSchemeViewBindingTreeNodeData;

export enum SchemeRunBlocker {
    SchemeDoesNotExist,
    AlreadyRunning,
    SchemeBindingsDoesNotExist,
    SomeHubsAreNotConnected,
    SomeIosAreNotConnected,
    SomeIosHaveNoRequiredCapabilities,
    SomeControllersAreNotConnected,
}
