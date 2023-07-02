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
    CONTROLLER_SELECTORS,
    CONTROL_SCHEME_SELECTORS,
    ControlSchemeBinding,
    ControlSchemeModel,
    ControllerModel,
    HUBS_SELECTORS,
    HUB_PORT_TASKS_SELECTORS,
    HUB_STATS_SELECTORS,
    HubModel,
    HubStatsModel,
    ROUTER_SELECTORS,
    attachedIoModesIdFn,
    attachedIoPortModeInfoIdFn,
    attachedIosIdFn
} from '../store';
import { ControllerInputType, HUB_IO_CONTROL_METHODS, HubIoOperationMode } from '@app/shared';

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
    lastExecutedTasksBindingIds: ReadonlySet<string>,
    io?: AttachedIoModel,
): ControlSchemeViewBindingTreeNode {
    let ioHasNoRequiredCapabilities = false;
    if (io) {
        const ioOperationModes = getHubIoOperationModes(
            io,
            ioSupportedModesEntities,
            portModeInfoEntities,
            binding.input.inputType
        );
        ioHasNoRequiredCapabilities = !ioOperationModes.includes(binding.output.operationMode);
    }
    return {
        path: `${ioPath}.${binding.id}`,
        nodeType: ControlSchemeNodeTypes.Binding,
        controller: controllerEntities[binding.input.controllerId],
        inputId: binding.input.inputId,
        inputType: binding.input.inputType,
        isActive: lastExecutedTasksBindingIds.has(binding.id),
        operationMode: binding.output.operationMode,
        ioHasNoRequiredCapabilities,
        children: []
    };
}

function selectIosControllableByInputType(
    ios: AttachedIoModel[],
    supportedModes: Dictionary<AttachedIoModesModel>,
    portModeData: Dictionary<AttachedIoPortModeInfoModel>,
    inputType: ControllerInputType
): Array<IoWithOperationModes> {
    const applicablePortModes: Set<PortModeName> = new Set(Object.values(HUB_IO_CONTROL_METHODS[inputType]));
    const result: Array<{ ioConfig: AttachedIoModel, operationModes: HubIoOperationMode[] }> = [];
    for (const io of ios) {
        const ioOperationModes = getHubIoOperationModes(io, supportedModes, portModeData, inputType)
            .filter((mode) => {
                const portMode = HUB_IO_CONTROL_METHODS[inputType][mode];
                return portMode !== undefined && applicablePortModes.has(portMode);
            });

        if (ioOperationModes.length > 0) {
            result.push({
                ioConfig: io,
                operationModes: ioOperationModes
            });
        }
    }
    return result;
}

function getHubIoOperationModes(
    io: AttachedIoModel,
    supportedModes: ReturnType<typeof ATTACHED_IO_MODES_SELECTORS.selectEntities>,
    portModeData: ReturnType<typeof ATTACHED_IO_PORT_MODE_INFO_SELECTORS.selectEntities>,
    inputType: ControllerInputType
): HubIoOperationMode[] {
    const outputModes = supportedModes[attachedIoModesIdFn(io)]?.portOutputModes;

    if (outputModes && outputModes.length > 0) {
        return outputModes.map((modeId) => {
            const portModeId = attachedIoPortModeInfoIdFn({ ...io, modeId });
            const portModeInfo = portModeData[portModeId];
            if (portModeInfo && Object.values(HUB_IO_CONTROL_METHODS[inputType]).includes(portModeInfo.name)) {
                return Object.entries(HUB_IO_CONTROL_METHODS[inputType])
                             .filter(([ , modeName ]) => modeName === portModeInfo.name)
                             .map(([ operationMode ]) => operationMode as HubIoOperationMode);
            }
            return [];
        }).flat();
    }
    return [];
}

export type IoWithOperationModes = {
    ioConfig: AttachedIoModel,
    operationModes: HubIoOperationMode[]
};

export enum ControlSchemeNodeTypes {
    Hub = 'Hub',
    Io = 'Io',
    Binding = 'Binding',
}

export type ControlSchemeViewBindingTreeNode = {
    readonly path: string;
    readonly nodeType: ControlSchemeNodeTypes.Binding;
    readonly controller?: ControllerModel;
    readonly inputId: string;
    readonly inputType: ControllerInputType;
    readonly isActive: boolean;
    readonly operationMode: HubIoOperationMode;
    readonly ioHasNoRequiredCapabilities: boolean;
    readonly children: [];
}

export type ControlSchemeViewIoTreeNode = {
    readonly path: string;
    readonly nodeType: ControlSchemeNodeTypes.Io;
    readonly portId: number;
    readonly ioType: IOType | null;
    readonly isConnected: boolean;
    readonly children: ControlSchemeViewBindingTreeNode[];
}

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

export const CONTROL_SCHEMES_LIST_SELECTORS = {
    schemeViewTree: (schemeId: string) => createSelector(
        CONTROL_SCHEME_SELECTORS.selectScheme(schemeId),
        HUBS_SELECTORS.selectEntities,
        HUB_STATS_SELECTORS.selectEntities,
        ATTACHED_IO_SELECTORS.selectEntities,
        ATTACHED_IO_MODES_SELECTORS.selectEntities,
        ATTACHED_IO_PORT_MODE_INFO_SELECTORS.selectEntities,
        CONTROLLER_SELECTORS.selectEntities,
        HUB_PORT_TASKS_SELECTORS.selectLastExecutedBindingIds,
        (
            scheme: ControlSchemeModel | undefined,
            hubEntities: Dictionary<HubModel>,
            statsEntities: Dictionary<HubStatsModel>,
            ios: Dictionary<AttachedIoModel>,
            ioSupportedModesEntities: Dictionary<AttachedIoModesModel>,
            portModeInfoEntities: Dictionary<AttachedIoPortModeInfoModel>,
            controllerEntities: Dictionary<ControllerModel>,
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
                    lastExecutedTasksBindingIds,
                    io
                );

                ioViewModel.children.push(bindingTreeNode);
            });
            return [ ...hubsViewMap.values() ];
        }
    ),
    canRunScheme: (schemeId: string) => createSelector( // TODO: performance-wise, this selector is not optimal (should not use viewTree)
        CONTROL_SCHEMES_LIST_SELECTORS.schemeViewTree(schemeId),
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
    canAddBinding: createSelector(
        HUBS_SELECTORS.selectAll,
        CONTROLLER_SELECTORS.selectAll,
        (hubs, controllers) => hubs.length > 0 && controllers.length > 0
    ),
    selectSchemesList: createSelector(
        CONTROL_SCHEME_SELECTORS.selectAll,
        CONTROL_SCHEME_SELECTORS.selectRunningSchemeId,
        (schemes, runningSchemeId) => {
            return schemes.map((scheme) => ({
                ...scheme,
                isRunning: scheme.id === runningSchemeId
            }));
        }
    ),
    selectHubsWithConnectionState: createSelector(
        HUBS_SELECTORS.selectAll,
        HUB_STATS_SELECTORS.selectEntities,
        (hubs, hubStats) => {
            return hubs.map((hub) => ({
                ...hub,
                isConnected: !!hubStats[hub.hubId]
            }));
        }
    ),
    selectFirstIoControllableByInputType: (inputType: ControllerInputType) => createSelector(
        ATTACHED_IO_SELECTORS.selectAll,
        ATTACHED_IO_MODES_SELECTORS.selectEntities,
        ATTACHED_IO_PORT_MODE_INFO_SELECTORS.selectEntities,
        (ios, supportedModes, portModeData) => selectIosControllableByInputType(ios, supportedModes, portModeData, inputType)[0]
    ),
    selectHubIosControllableByInputType: (hubId: string, inputType: ControllerInputType) => createSelector(
        ATTACHED_IO_SELECTORS.selectHubIos(hubId),
        ATTACHED_IO_MODES_SELECTORS.selectEntities,
        ATTACHED_IO_PORT_MODE_INFO_SELECTORS.selectEntities,
        (ios, supportedModes, portModeData) => selectIosControllableByInputType(ios, supportedModes, portModeData, inputType)
    ),
    canCalibrateServo: ({ hubId, portId }: { hubId: string, portId: number }) => createSelector(
        HUB_STATS_SELECTORS.selectIsHubConnected(hubId),
        ATTACHED_IO_SELECTORS.selectIoAtPort({ hubId, portId }),
        ATTACHED_IO_MODES_SELECTORS.selectEntities,
        ATTACHED_IO_PORT_MODE_INFO_SELECTORS.selectEntities,
        (isHubConnected, io, supportedModesEntities, portModesEntities) => {
            if (!io || !isHubConnected) {
                return false;
            }
            const modesInfo: AttachedIoModesModel | undefined =
                supportedModesEntities[attachedIoModesIdFn(io)];
            if (!modesInfo) {
                return false;
            }
            const portOutputModes = modesInfo.portOutputModes;
            const portModes = new Set(portOutputModes
                .map((modeId) => portModesEntities[attachedIoPortModeInfoIdFn({ ...io, modeId })])
                .map((portModeInfo) => portModeInfo?.name)
                .filter((portModeInfo) => !!portModeInfo)
            ) as ReadonlySet<PortModeName>;

            return portModes.has(PortModeName.position) && portModes.has(PortModeName.absolutePosition);
        }
    ),
    selectHubIoOperationModes: (
        hubId: string,
        portId: number,
        inputType: ControllerInputType
    ) => createSelector(
        ATTACHED_IO_SELECTORS.selectIoAtPort({ hubId, portId }),
        ATTACHED_IO_MODES_SELECTORS.selectEntities,
        ATTACHED_IO_PORT_MODE_INFO_SELECTORS.selectEntities,
        (io, supportedModes, portModeData) => {
            if (io) {
                return getHubIoOperationModes(io, supportedModes, portModeData, inputType);
            }
            return [];
        }
    ),
} as const;
