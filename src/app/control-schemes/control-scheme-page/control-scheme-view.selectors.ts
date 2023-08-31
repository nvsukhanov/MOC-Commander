import { Dictionary } from '@ngrx/entity';
import { HubType, PortModeName } from 'rxpoweredup';
import { createSelector } from '@ngrx/store';
import {
    ATTACHED_IO_MODES_SELECTORS,
    ATTACHED_IO_PORT_MODE_INFO_SELECTORS,
    ATTACHED_IO_SELECTORS,
    AttachedIoModel,
    AttachedIoModesModel,
    AttachedIoPortModeInfoModel,
    CONTROLLER_CONNECTION_SELECTORS,
    CONTROL_SCHEME_SELECTORS,
    ControlSchemeBinding,
    ControlSchemeModel,
    ControlSchemePortConfig,
    ControlSchemeRunState,
    ControllerConnectionModel,
    HUBS_SELECTORS,
    HUB_STATS_SELECTORS,
    HubModel,
    HubStatsModel,
    PORT_TASKS_SELECTORS,
    PortTasksModel,
    ROUTER_SELECTORS,
    attachedIoModesIdFn,
    attachedIoPortModeInfoIdFn,
    attachedIosIdFn,
    hubPortTasksIdFn
} from '@app/store';

import { ioHasMatchingModeForOpMode } from '../io-has-matching-mode-for-op-mode';
import { ControlSchemeNodeTypes, ControlSchemeViewBindingTreeNodeData, ControlSchemeViewHubTreeNode, ControlSchemeViewIoTreeNode } from './types';
import { areControllableIosPresent } from '../are-controllable-ios-present';

function createHubTreeNode(
    hubConfig: { hubId: string; name?: string; hubType?: HubType },
    hubStats?: HubStatsModel,
): ControlSchemeViewHubTreeNode {
    const result: ControlSchemeViewHubTreeNode = {
        path: hubConfig.hubId,
        hubId: hubConfig.hubId,
        batteryLevel: hubStats?.batteryLevel ?? null,
        rssi: hubStats?.rssi ?? null,
        isButtonPressed: hubStats?.isButtonPressed ?? false,
        hasCommunication: hubStats?.hasCommunication ?? false,
        nodeType: ControlSchemeNodeTypes.Hub,
        isConnected: !!hubStats,
        children: [],
        initiallyExpanded: true
    };
    if (hubConfig.name !== undefined) {
        result.name = hubConfig.name;
    }
    if (hubConfig.hubType !== undefined) {
        result.hubType = hubConfig.hubType;
    }
    return result;
}

function createIoTreeNode(
    parentPath: string,
    hubId: string,
    isHubConnected: boolean,
    iosEntities: Dictionary<AttachedIoModel>,
    portId: number,
    bindings: ControlSchemeBinding[],
    portConfigs: ControlSchemePortConfig[],
    schemeName: string,
    portTasksModelDictionary: Dictionary<PortTasksModel>
): ControlSchemeViewIoTreeNode {
    const ioId = attachedIosIdFn({ hubId, portId });
    const io = iosEntities[ioId];
    const portConfig = portConfigs.find((config) => config.portId === portId && config.hubId === hubId);
    const useAccelerationProfile = bindings.filter((b) => b.useAccelerationProfile && b.portId === portId && b.hubId === hubId)
        .length > 0;
    const useDecelerationProfile = bindings.filter((b) => b.useDecelerationProfile && b.portId === portId && b.hubId === hubId)
        .length > 0;

    const runningTask = portTasksModelDictionary[hubPortTasksIdFn({ hubId, portId })]?.runningTask ?? undefined;
    const lastExecutedTask = portTasksModelDictionary[hubPortTasksIdFn({ hubId, portId })]?.lastExecutedTask ?? undefined;

    return {
        path: `${parentPath}.${portId}`,
        nodeType: ControlSchemeNodeTypes.Io,
        portId: portId,
        ioType: io?.ioType ?? null,
        isConnected: isHubConnected && !!io,
        hubId,
        schemeName,
        useAccelerationProfile,
        accelerationTimeMs: portConfig?.accelerationTimeMs ?? 0,
        useDecelerationProfile,
        decelerationTimeMs: portConfig?.decelerationTimeMs ?? 0,
        runningTask,
        lastExecutedTask,
        children: [],
        initiallyExpanded: false
    };
}

function createBindingTreeNode(
    ioPath: string,
    binding: ControlSchemeBinding,
    schemeName: string,
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
        schemeName,
        ioHasNoRequiredCapabilities,
        children: [],
        initiallyExpanded: false
    };
}

export const CONTROL_SCHEME_VIEW_SELECTORS = {
    schemeViewTree: (schemeName: string) => createSelector(
        CONTROL_SCHEME_SELECTORS.selectScheme(schemeName),
        HUBS_SELECTORS.selectEntities,
        HUB_STATS_SELECTORS.selectEntities,
        ATTACHED_IO_SELECTORS.selectEntities,
        ATTACHED_IO_MODES_SELECTORS.selectEntities,
        ATTACHED_IO_PORT_MODE_INFO_SELECTORS.selectEntities,
        PORT_TASKS_SELECTORS.selectLastExecutedBindingIds,
        PORT_TASKS_SELECTORS.selectEntities,
        (
            scheme: ControlSchemeModel | undefined,
            hubEntities: Dictionary<HubModel>,
            statsEntities: Dictionary<HubStatsModel>,
            iosEntities: Dictionary<AttachedIoModel>,
            ioSupportedModesEntities: Dictionary<AttachedIoModesModel>,
            portModeInfoEntities: Dictionary<AttachedIoPortModeInfoModel>,
            lastExecutedTasksBindingIds: ReadonlySet<string>,
            portCommandTasksEntities: Dictionary<PortTasksModel>,
        ): ControlSchemeViewHubTreeNode[] => {
            if (!scheme) {
                return [];
            }
            const hubsViewMap = new Map<string, ControlSchemeViewHubTreeNode>();
            const ioOutputPortModeNamesMap = new Map<string, PortModeName[]>();

            for (const ioId of Object.keys(iosEntities)) {
                const io = iosEntities[ioId];
                if (!io) {
                    continue;
                }
                const ioSupportedModes = ioSupportedModesEntities[attachedIoModesIdFn(io)];
                if (!ioSupportedModes) {
                    continue;
                }
                const ioOutputModes = ioSupportedModes.portOutputModes;
                const ioOutputPortModeNames = ioOutputModes.map((modeId) => {
                    const portModeInfo = portModeInfoEntities[attachedIoPortModeInfoIdFn({ ...io, modeId })];
                    return portModeInfo?.name ?? null;
                }).filter((name): name is PortModeName => !!name);
                ioOutputPortModeNamesMap.set(ioId, ioOutputPortModeNames);
            }

            function ensureHubNodeCreated(
                hubConfiguration: { hubId: string; name?: string; hubType?: HubType }
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
                const hubTreeNode = ensureHubNodeCreated(hubConfig ?? { hubId: binding.hubId });
                const ioId = attachedIosIdFn(binding);

                let ioViewModel = hubIosViewMap.get(ioId);
                if (!ioViewModel) {
                    ioViewModel = createIoTreeNode(
                        hubTreeNode.path,
                        binding.hubId,
                        !!hubConfig && !!statsEntities[hubConfig.hubId],
                        iosEntities,
                        binding.portId,
                        scheme.bindings,
                        scheme.portConfigs,
                        schemeName,
                        portCommandTasksEntities
                    );
                    hubIosViewMap.set(ioId, ioViewModel);

                    hubTreeNode.children.push(ioViewModel);
                }

                const io = iosEntities[ioId];
                const bindingTreeNode = createBindingTreeNode(
                    ioViewModel.path,
                    binding,
                    schemeName,
                    ioOutputPortModeNamesMap.get(ioId) ?? [],
                    lastExecutedTasksBindingIds,
                    io
                );

                ioViewModel.children.push(bindingTreeNode);
            });
            return [ ...hubsViewMap.values() ];
        }
    ),
    canRunScheme: (schemeName: string) => createSelector( // TODO: performance-wise, this selector is not optimal (should not use viewTree)
        CONTROL_SCHEME_VIEW_SELECTORS.schemeViewTree(schemeName),
        CONTROL_SCHEME_SELECTORS.selectRunningState,
        CONTROLLER_CONNECTION_SELECTORS.selectEntities,
        (
            viewTree,
            runningState,
            controllerConnectionEntities: Dictionary<ControllerConnectionModel>
        ): boolean => {
            let allHubAreConnected = true;
            let allIosAreConnected = true;
            let allIosTypesMatches = true;
            let allControllersConnected = true;
            let hasBindings = false;
            if (runningState !== ControlSchemeRunState.Idle) {
                return false;
            }
            viewTree.forEach((hubNode) => {
                allHubAreConnected = allHubAreConnected && hubNode.isConnected;
                hubNode.children.forEach((ioNode) => {
                    allIosAreConnected = allIosAreConnected && ioNode.isConnected;
                    allIosTypesMatches = allIosTypesMatches && ioNode.children.every((c) => !c.ioHasNoRequiredCapabilities);
                    ioNode.children.forEach((c) => {
                        Object.values(c.binding.inputs).forEach((input) => {
                            if (input.controllerId !== null) {
                                allControllersConnected = allControllersConnected && !!controllerConnectionEntities[input.controllerId];
                            }
                        });
                    });
                    hasBindings = hasBindings || ioNode.children.length > 0;
                });
            });
            return allHubAreConnected && allIosAreConnected && allIosTypesMatches && allControllersConnected && hasBindings;
        }
    ),
    isCurrentControlSchemeRunning: createSelector(
        CONTROL_SCHEME_SELECTORS.selectRunningSchemeName,
        ROUTER_SELECTORS.selectCurrentlyViewedSchemeName,
        (
            runningSchemeName,
            routerSchemeName
        ) => runningSchemeName !== null && runningSchemeName === routerSchemeName
    ),
    canCreateBinding: createSelector(
        ATTACHED_IO_SELECTORS.selectAll,
        ATTACHED_IO_MODES_SELECTORS.selectEntities,
        ATTACHED_IO_PORT_MODE_INFO_SELECTORS.selectEntities,
        (ios, ioSupportedModesEntities, portModeInfoEntities) => areControllableIosPresent(ios, ioSupportedModesEntities, portModeInfoEntities)
    )
} as const;
