import { HubType, IOType } from '@nvsukhanov/rxpoweredup';
import { ControlSchemeBinding, PortCommandTask } from '@app/store';

export enum ControlSchemeNodeTypes {
    Hub = 'Hub',
    Io = 'Io',
    Binding = 'Binding',
}

export type ControlSchemeViewBindingTreeNodeData = {
    readonly path: string;
    readonly nodeType: ControlSchemeNodeTypes.Binding;
    readonly isActive: boolean; // TODO: remove, may impact performance, Use ad-hoc selector instead
    readonly controlSchemeId: string;
    readonly binding: ControlSchemeBinding;
    readonly ioHasNoRequiredCapabilities: boolean;
    readonly children: [];
    readonly initiallyExpanded: boolean;
};

export type ControlSchemeViewIoTreeNode = {
    readonly path: string;
    readonly nodeType: ControlSchemeNodeTypes.Io;
    readonly controlSchemeId: string;
    readonly hubId: string;
    readonly portId: number;
    readonly ioType: IOType | null;
    readonly isConnected: boolean;
    readonly useAccelerationProfile: boolean;
    readonly accelerationTimeMs: number;
    readonly useDecelerationProfile: boolean;
    readonly decelerationTimeMs: number;
    readonly runningTask?: PortCommandTask;
    readonly lastExecutedTask?: PortCommandTask;
    readonly children: ControlSchemeViewBindingTreeNodeData[];
    readonly initiallyExpanded: boolean;
};

export type ControlSchemeViewHubTreeNode = {
    readonly path: string;
    readonly nodeType: ControlSchemeNodeTypes.Hub;
    readonly hubId: string;
    readonly name: string;
    readonly batteryLevel: number | null;  // TODO: remove, may impact performance, Use ad-hoc selector instead
    readonly rssi: number | null;  // TODO: remove, may impact performance, Use ad-hoc selector instead
    readonly hubType: HubType;
    readonly isButtonPressed: boolean;  // TODO: remove, may impact performance, Use ad-hoc selector instead
    readonly hasCommunication: boolean;  // TODO: remove, may impact performance, Use ad-hoc selector instead
    readonly isConnected: boolean;
    readonly children: ControlSchemeViewIoTreeNode[];
    readonly initiallyExpanded: boolean;
};

export type ControlSchemeViewTreeNode = ControlSchemeViewHubTreeNode
    | ControlSchemeViewIoTreeNode
    | ControlSchemeViewBindingTreeNodeData;
