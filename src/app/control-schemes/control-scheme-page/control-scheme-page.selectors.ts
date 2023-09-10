import { Dictionary } from '@ngrx/entity';
import { HubType, PortModeName } from 'rxpoweredup';
import { createSelector } from '@ngrx/store';
import {
    ATTACHED_IO_MODES_SELECTORS,
    ATTACHED_IO_PORT_MODE_INFO_SELECTORS,
    ATTACHED_IO_SELECTORS,
    AttachedIoModel,
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
    hubPortTasksIdFn,
} from '@app/store';

import { areControllableIosPresent, ioHasMatchingModeForOpMode } from '../common';
import { ControlSchemeNodeTypes, ControlSchemeViewBindingTreeNodeData, ControlSchemeViewHubTreeNode, ControlSchemeViewIoTreeNode } from './types';

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
        children: []
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
        children: []
    };
}

function createBindingTreeNode(
    ioPath: string,
    binding: ControlSchemeBinding,
    schemeName: string,
    portOutputModeNames: PortModeName[],
    lastExecutedTasksBindingIds: ReadonlySet<number>,
    io?: AttachedIoModel,
): ControlSchemeViewBindingTreeNodeData {
    const ioHasNoRequiredCapabilities = io ?
                                        !ioHasMatchingModeForOpMode(binding.bindingType, portOutputModeNames)
                                           : true;
    return {
        path: `${ioPath}.${binding.id}`,
        nodeType: ControlSchemeNodeTypes.Binding,
        isActive: lastExecutedTasksBindingIds.has(binding.id),
        binding,
        schemeName,
        ioHasNoRequiredCapabilities,
        children: []
    };
}

export const CONTROL_SCHEME_PAGE_SELECTORS = {
    selectIoOutputModes: createSelector(
        ATTACHED_IO_SELECTORS.selectAll,
        ATTACHED_IO_MODES_SELECTORS.selectEntities,
        ATTACHED_IO_PORT_MODE_INFO_SELECTORS.selectEntities,
        (ios, ioSupportedModesEntities, portModeInfoEntities): Record<string, PortModeName[]> => {
            const result: Record<string, PortModeName[]> = {};
            for (const io of ios) {
                const ioId = attachedIosIdFn(io);
                result[ioId] = (ioSupportedModesEntities[attachedIoModesIdFn(io)]?.portOutputModes ?? []).map((modeId) => {
                    const portModeInfo = portModeInfoEntities[attachedIoPortModeInfoIdFn({ ...io, modeId })];
                    return portModeInfo?.name ?? null;
                }).filter((name): name is PortModeName => !!name);
            }
            return result;
        }
    ),
    schemeViewTree: (schemeName: string) => createSelector(
        CONTROL_SCHEME_SELECTORS.selectScheme(schemeName),
        HUBS_SELECTORS.selectEntities,
        HUB_STATS_SELECTORS.selectEntities,
        ATTACHED_IO_SELECTORS.selectEntities,
        PORT_TASKS_SELECTORS.selectLastExecutedBindingIds,
        PORT_TASKS_SELECTORS.selectEntities,
        CONTROL_SCHEME_PAGE_SELECTORS.selectIoOutputModes,
        (
            scheme: ControlSchemeModel | undefined,
            hubEntities: Dictionary<HubModel>,
            statsEntities: Dictionary<HubStatsModel>,
            iosEntities: Dictionary<AttachedIoModel>,
            lastExecutedTasksBindingIds: ReadonlySet<number>,
            portCommandTasksEntities: Dictionary<PortTasksModel>,
            ioOutputModes: Record<string, PortModeName[]>
        ): ControlSchemeViewHubTreeNode[] => {
            if (!scheme) {
                return [];
            }
            const hubsViewMap = new Map<string, ControlSchemeViewHubTreeNode>();

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
                    ioOutputModes[ioId] ?? [],
                    lastExecutedTasksBindingIds,
                    io
                );

                ioViewModel.children.push(bindingTreeNode);
            });
            return [ ...hubsViewMap.values() ];
        }
    ),
    canRunScheme: (schemeName: string) => createSelector(
        CONTROL_SCHEME_SELECTORS.selectScheme(schemeName),
        CONTROL_SCHEME_SELECTORS.selectRunningState,
        HUB_STATS_SELECTORS.selectIds,
        CONTROL_SCHEME_PAGE_SELECTORS.selectIoOutputModes,
        CONTROLLER_CONNECTION_SELECTORS.selectEntities,
        (
            scheme: ControlSchemeModel | undefined,
            runningState: ControlSchemeRunState,
            connectedHubIds: string[],
            ioOutputModes: Record<string, PortModeName[]>,
            controllerConnections: Dictionary<ControllerConnectionModel>
        ): boolean => {
            // ensure scheme is runnable (exists, there are no currently running schemes and scheme has bindings)
            if (!scheme || runningState !== ControlSchemeRunState.Idle || !scheme.bindings.length) {
                return false;
            }
            // ensure all hubs are connected
            if (scheme.bindings.some((b) => !connectedHubIds.includes(b.hubId))) {
                return false;
            }
            // ensure all ios are connected and has matching necessary capabilities
            if (scheme.bindings.some((b) => !ioHasMatchingModeForOpMode(b.bindingType, ioOutputModes[attachedIosIdFn(b)] ?? []))) {
                return false;
            }
            // ensure all controllers are connected
            return scheme.bindings.every((b) => {
                const controllerIds = Object.values(b.inputs).map((input) => input.controllerId);
                return controllerIds.every((controllerId) => !!controllerConnections[controllerId]);
            });
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
