import { Dictionary } from '@ngrx/entity';
import { HubType, IOType, PortModeName } from '@nvsukhanov/rxpoweredup';
import { createSelector } from '@ngrx/store';
import {
    ATTACHED_IO_MODES_SELECTORS,
    ATTACHED_IO_PORT_MODE_INFO_SELECTORS,
    ATTACHED_IO_SELECTORS,
    AttachedIoModel,
    AttachedIoModesModel,
    AttachedIoPortModeInfoModel,
    CONTROL_SCHEME_SELECTORS,
    CONTROL_SCHEME_V2_SELECTORS,
    ControlSchemeV2Binding,
    ControlSchemeV2Model,
    HUBS_SELECTORS,
    HUB_STATS_SELECTORS,
    HubModel,
    HubStatsModel,
    PORT_TASKS_SELECTORS,
    ROUTER_SELECTORS,
    attachedIosIdFn
} from '@app/store';

import { ioHasMatchingModeForOpMode } from '../io-has-matching-mode-for-op-mode';

function createHubTreeNode(
    hubConfig: HubModel,
    hubStats?: HubStatsModel,
): ControlSchemeViewHubTreeNode {
    return {
        path: hubConfig.hubId,
        hubId: hubConfig.hubId,
        name: hubConfig.name,
        batteryLevel: hubStats?.batteryLevel ?? null,
        rssi: hubStats?.rssi ?? null,
        hubType: hubConfig.hubType,
        isButtonPressed: hubStats?.isButtonPressed ?? false,
        hasCommunication: hubStats?.hasCommunication ?? false,
        nodeType: ControlSchemeNodeTypes.Hub,
        isConnected: !!hubStats,
        children: []
    };
}

function createIoTreeNode(
    parentPath: string,
    hubConfig: HubModel,
    isHubConnected: boolean,
    iosEntities: Dictionary<AttachedIoModel>,
    portId: number,
): ControlSchemeViewIoTreeNode {
    const ioId = attachedIosIdFn({ hubId: hubConfig.hubId, portId });
    const io = iosEntities[ioId];

    return {
        path: `${parentPath}.${portId}`,
        nodeType: ControlSchemeNodeTypes.Io,
        portId: portId,
        ioType: io?.ioType ?? null,
        isConnected: isHubConnected && !!io,
        children: []
    };
}

function createBindingTreeNode(
    ioPath: string,
    binding: ControlSchemeV2Binding,
    ioSupportedModesEntities: Dictionary<AttachedIoModesModel>,
    portOutputModeNames: PortModeName[],
    lastExecutedTasksBindingIds: ReadonlySet<string>,
    io?: AttachedIoModel,
): ControlSchemeViewBindingTreeNodeData {
    const ioHasNoRequiredCapabilities = io ?
                                        !ioHasMatchingModeForOpMode(binding.operationMode, portOutputModeNames)
                                           : true;
    return {
        path: `${ioPath}.${binding.id}`,
        nodeType: ControlSchemeNodeTypes.Binding,
        isActive: lastExecutedTasksBindingIds.has(binding.id),
        binding,
        ioHasNoRequiredCapabilities,
        children: []
    };
}

export enum ControlSchemeNodeTypes {
    Hub = 'Hub',
    Io = 'Io',
    Binding = 'Binding',
}

export type ControlSchemeViewBindingTreeNodeData = {
    readonly path: string;
    readonly nodeType: ControlSchemeNodeTypes.Binding;
    readonly isActive: boolean;
    readonly binding: ControlSchemeV2Binding;
    readonly ioHasNoRequiredCapabilities: boolean;
    readonly children: [];
};

export type ControlSchemeViewIoTreeNode = {
    readonly path: string;
    readonly nodeType: ControlSchemeNodeTypes.Io;
    readonly portId: number;
    readonly ioType: IOType | null;
    readonly isConnected: boolean;
    readonly children: ControlSchemeViewBindingTreeNodeData[];
};

export type ControlSchemeViewHubTreeNode = {
    readonly path: string;
    readonly nodeType: ControlSchemeNodeTypes.Hub;
    readonly hubId: string;
    readonly name: string;
    readonly batteryLevel: number | null;
    readonly rssi: number | null;
    readonly hubType: HubType;
    readonly isButtonPressed: boolean;
    readonly hasCommunication: boolean;
    readonly isConnected: boolean;
    readonly children: ControlSchemeViewIoTreeNode[];
};

export type ControlSchemeViewTreeNode = ControlSchemeViewHubTreeNode
    | ControlSchemeViewIoTreeNode
    | ControlSchemeViewBindingTreeNodeData;

export const CONTROL_SCHEME_VIEW_SELECTORS = {
    schemeViewTree: (schemeId: string) => createSelector(
        CONTROL_SCHEME_V2_SELECTORS.selectScheme(schemeId),
        HUBS_SELECTORS.selectEntities,
        HUB_STATS_SELECTORS.selectEntities,
        ATTACHED_IO_SELECTORS.selectEntities,
        ATTACHED_IO_MODES_SELECTORS.selectEntities,
        ATTACHED_IO_PORT_MODE_INFO_SELECTORS.selectEntities,
        PORT_TASKS_SELECTORS.selectLastExecutedBindingIds,
        (
            scheme: ControlSchemeV2Model | undefined,
            hubEntities: Dictionary<HubModel>,
            statsEntities: Dictionary<HubStatsModel>,
            iosEntities: Dictionary<AttachedIoModel>,
            ioSupportedModesEntities: Dictionary<AttachedIoModesModel>,
            portModeInfoEntities: Dictionary<AttachedIoPortModeInfoModel>,
            lastExecutedTasksBindingIds: ReadonlySet<string>
        ): ControlSchemeViewHubTreeNode[] => {
            if (!scheme) {
                return [];
            }
            const hubsViewMap = new Map<string, ControlSchemeViewHubTreeNode>();
            const ioOutputPortModeNamesMap = new Map<string, PortModeName[]>();

            for (const ioId in Object.keys(iosEntities)) {
                const io = iosEntities[ioId];
                if (!io) {
                    continue;
                }
                const ioSupportedModes = ioSupportedModesEntities[ioId];
                if (!ioSupportedModes) {
                    continue;
                }
                const ioOutputModes = ioSupportedModes.portOutputModes;
                const ioOutputPortModeNames = ioOutputModes.map((modeId) => {
                    const portModeInfo = portModeInfoEntities[`${ioId}.${modeId}`];
                    return portModeInfo?.name ?? null;
                }).filter((name): name is PortModeName => !!name);
                ioOutputPortModeNamesMap.set(ioId, ioOutputPortModeNames);
            }

            function ensureHubNodeCreated(
                hubConfiguration: HubModel
            ): ControlSchemeViewHubTreeNode {
                let hubTreeNode = hubsViewMap.get(hubConfiguration.hubId);
                if (!hubTreeNode) {
                    hubTreeNode = createHubTreeNode(
                        hubConfiguration,
                        statsEntities[hubConfiguration.hubId],
                    );
                    hubsViewMap.set(hubConfiguration.hubId, hubTreeNode);
                }
                return hubTreeNode;
            }

            const hubIosViewMap = new Map<string, ControlSchemeViewIoTreeNode>();
            [ ...scheme.bindings ].sort((a, b) => a.portId - b.portId).forEach((binding) => {
                const hubConfig = hubEntities[binding.hubId];
                if (!hubConfig) {
                    return;
                }
                const ioId = attachedIosIdFn(binding);

                let ioViewModel = hubIosViewMap.get(ioId);
                if (!ioViewModel) {
                    const hubTreeNode = ensureHubNodeCreated(hubConfig);
                    ioViewModel = createIoTreeNode(
                        hubTreeNode.path,
                        hubConfig,
                        !!statsEntities[hubConfig.hubId],
                        iosEntities,
                        binding.portId
                    );
                    hubIosViewMap.set(ioId, ioViewModel);

                    hubTreeNode.children.push(ioViewModel);
                }

                const io = iosEntities[ioId];
                const bindingTreeNode = createBindingTreeNode(
                    ioViewModel.path,
                    binding,
                    ioSupportedModesEntities,
                    ioOutputPortModeNamesMap.get(ioId) ?? [],
                    lastExecutedTasksBindingIds,
                    io
                );

                ioViewModel.children.push(bindingTreeNode);
            });
            return [ ...hubsViewMap.values() ];
        }
    ),
    canRunScheme: (schemeId: string) => createSelector( // TODO: performance-wise, this selector is not optimal (should not use viewTree)
        CONTROL_SCHEME_VIEW_SELECTORS.schemeViewTree(schemeId),
        CONTROL_SCHEME_SELECTORS.selectRunningSchemeId,
        (
            viewTree,
            runningSchemeId
        ): boolean => {
            let allHubAreConnected = true;
            let allIosAreConnected = true;
            let allIosTypesMatches = true;
            if (runningSchemeId !== null) {
                return false;
            }
            viewTree.forEach((hubNode) => {
                allHubAreConnected = allHubAreConnected && hubNode.isConnected;
                hubNode.children.forEach((ioNode) => {
                    allIosAreConnected = allIosAreConnected && ioNode.isConnected;
                    allIosTypesMatches = allIosTypesMatches && ioNode.children.every((c) => !c.ioHasNoRequiredCapabilities);
                });
            });
            return allHubAreConnected && allIosAreConnected && allIosTypesMatches;
        }
    ),
    isCurrentControlSchemeRunning: createSelector(
        CONTROL_SCHEME_SELECTORS.selectRunningSchemeId,
        ROUTER_SELECTORS.selectRouteParam('id'),
        (
            runningSchemeId,
            schemeId
        ) => runningSchemeId !== null && runningSchemeId === schemeId
    ),
} as const;
