import { HubType, IOType } from 'rxpoweredup';
import { ControlSchemeBinding, PortCommandTask } from '@app/store';

export enum ControlSchemeNodeTypes {
    Hub = 'Hub',
    Io = 'Io',
    Binding = 'Binding',
}

export type ControlSchemeViewBindingTreeNodeData = {
    path: string;
    nodeType: ControlSchemeNodeTypes.Binding;
    isActive: boolean; // TODO: remove, may impact performance, Use ad-hoc selector instead
    schemeName: string;
    binding: ControlSchemeBinding;
    ioHasNoRequiredCapabilities: boolean;
    children: [];
    initiallyExpanded: boolean;
};

export type ControlSchemeViewIoTreeNode = {
    path: string;
    nodeType: ControlSchemeNodeTypes.Io;
    schemeName: string;
    hubId: string;
    portId: number;
    ioType: IOType | null;
    isConnected: boolean;
    useAccelerationProfile: boolean;
    accelerationTimeMs: number;
    useDecelerationProfile: boolean;
    decelerationTimeMs: number;
    runningTask?: PortCommandTask;
    lastExecutedTask?: PortCommandTask;
    children: ControlSchemeViewBindingTreeNodeData[];
    initiallyExpanded: boolean;
};

export type ControlSchemeViewHubTreeNode = {
    path: string;
    nodeType: ControlSchemeNodeTypes.Hub;
    hubId: string;
    name?: string;
    batteryLevel: number | null;  // TODO: remove, may impact performance, Use ad-hoc selector instead
    rssi: number | null;  // TODO: remove, may impact performance, Use ad-hoc selector instead
    hubType?: HubType;
    isButtonPressed: boolean;  // TODO: remove, may impact performance, Use ad-hoc selector instead
    hasCommunication: boolean;  // TODO: remove, may impact performance, Use ad-hoc selector instead
    isConnected: boolean;
    children: ControlSchemeViewIoTreeNode[];
    initiallyExpanded: boolean;
};

export type ControlSchemeViewTreeNode = ControlSchemeViewHubTreeNode
    | ControlSchemeViewIoTreeNode
    | ControlSchemeViewBindingTreeNodeData;
