import { Dictionary } from '@ngrx/entity';
import { HubType, IOType } from '@nvsukhanov/rxpoweredup';
import { createSelector } from '@ngrx/store';
import {
    ATTACHED_IO_MODES_SELECTORS,
    ATTACHED_IO_PORT_MODE_INFO_SELECTORS,
    ATTACHED_IO_SELECTORS,
    AttachedIoModel,
    AttachedIoModesModel,
    AttachedIoPortModeInfoModel,
    CONTROLLER_CONNECTION_SELECTORS,
    CONTROLLER_SELECTORS,
    CONTROL_SCHEME_SELECTORS,
    ControlSchemeBinding,
    ControlSchemeModel,
    ControllerConnectionModel,
    ControllerModel,
    HUBS_SELECTORS,
    HUB_STATS_SELECTORS,
    HubModel,
    HubStatsModel,
    PORT_TASKS_SELECTORS,
    ROUTER_SELECTORS,
    attachedIosIdFn
} from '@app/store';
import { ControllerInputType, HubIoOperationMode } from '@app/shared';

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
    binding: ControlSchemeBinding,
    ioSupportedModesEntities: Dictionary<AttachedIoModesModel>,
    portModeInfoEntities: Dictionary<AttachedIoPortModeInfoModel>,
    controllerEntities: Dictionary<ControllerModel>,
    controllerConnectionEntities: Dictionary<ControllerConnectionModel>,
    lastExecutedTasksBindingIds: ReadonlySet<string>,
    io?: AttachedIoModel,
): ControlSchemeViewBindingTreeNode {
    let ioHasNoRequiredCapabilities = false;
    if (io) {
        // const ioOperationModes = getHubIoOperationModes(
        //     io,
        //     ioSupportedModesEntities,
        //     portModeInfoEntities,
        //     binding.input.inputType
        // );
        ioHasNoRequiredCapabilities = false;
    }
    return {
        path: `${ioPath}.${binding.id}`,
        nodeType: ControlSchemeNodeTypes.Binding,
        controller: controllerEntities[binding.input.controllerId],
        controllerIsConnected: !!controllerConnectionEntities[binding.input.controllerId],
        inputId: binding.input.inputId,
        inputType: binding.input.inputType,
        isActive: lastExecutedTasksBindingIds.has(binding.id),
        operationMode: binding.output.operationMode,
        ioHasNoRequiredCapabilities,
        children: []
    };
}

export enum ControlSchemeNodeTypes {
    Hub = 'Hub',
    Io = 'Io',
    Binding = 'Binding',
}

export type ControlSchemeViewBindingTreeNode = {
    readonly path: string;
    readonly nodeType: ControlSchemeNodeTypes.Binding;
    readonly controller?: ControllerModel;
    readonly controllerIsConnected: boolean;
    readonly inputId: string;
    readonly inputType: ControllerInputType;
    readonly isActive: boolean;
    readonly operationMode: HubIoOperationMode;
    readonly ioHasNoRequiredCapabilities: boolean;
    readonly children: [];
};

export type ControlSchemeViewIoTreeNode = {
    readonly path: string;
    readonly nodeType: ControlSchemeNodeTypes.Io;
    readonly portId: number;
    readonly ioType: IOType | null;
    readonly isConnected: boolean;
    readonly children: ControlSchemeViewBindingTreeNode[];
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
    | ControlSchemeViewBindingTreeNode;

export const CONTROL_SCHEME_VIEW_SELECTORS = {
    schemeViewTree: (schemeId: string) => createSelector(
        CONTROL_SCHEME_SELECTORS.selectScheme(schemeId),
        HUBS_SELECTORS.selectEntities,
        HUB_STATS_SELECTORS.selectEntities,
        ATTACHED_IO_SELECTORS.selectEntities,
        ATTACHED_IO_MODES_SELECTORS.selectEntities,
        ATTACHED_IO_PORT_MODE_INFO_SELECTORS.selectEntities,
        CONTROLLER_SELECTORS.selectEntities,
        CONTROLLER_CONNECTION_SELECTORS.selectEntities,
        PORT_TASKS_SELECTORS.selectLastExecutedBindingIds,
        (
            scheme: ControlSchemeModel | undefined,
            hubEntities: Dictionary<HubModel>,
            statsEntities: Dictionary<HubStatsModel>,
            ios: Dictionary<AttachedIoModel>,
            ioSupportedModesEntities: Dictionary<AttachedIoModesModel>,
            portModeInfoEntities: Dictionary<AttachedIoPortModeInfoModel>,
            controllerEntities: Dictionary<ControllerModel>,
            controllerConnectionEntities: Dictionary<ControllerConnectionModel>,
            lastExecutedTasksBindingIds: ReadonlySet<string>
        ): ControlSchemeViewHubTreeNode[] => {
            if (!scheme) {
                return [];
            }
            const hubsViewMap = new Map<string, ControlSchemeViewHubTreeNode>();

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
            [ ...scheme.bindings ].sort((a, b) => a.output.portId - b.output.portId).forEach((binding) => {
                const hubConfig = hubEntities[binding.output.hubId];
                if (!hubConfig) {
                    return;
                }
                const ioId = attachedIosIdFn({ hubId: hubConfig.hubId, portId: binding.output.portId });

                let ioViewModel = hubIosViewMap.get(ioId);
                if (!ioViewModel) {
                    const hubTreeNode = ensureHubNodeCreated(hubConfig);
                    ioViewModel = createIoTreeNode(
                        hubTreeNode.path,
                        hubConfig,
                        !!statsEntities[hubConfig.hubId],
                        ios,
                        binding.output.portId
                    );
                    hubIosViewMap.set(ioId, ioViewModel);

                    hubTreeNode.children.push(ioViewModel);
                }

                const io = ios[attachedIosIdFn(binding.output)];
                const bindingTreeNode = createBindingTreeNode(
                    ioViewModel.path,
                    binding,
                    ioSupportedModesEntities,
                    portModeInfoEntities,
                    controllerEntities,
                    controllerConnectionEntities,
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
