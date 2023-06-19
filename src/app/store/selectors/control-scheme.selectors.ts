import { createFeatureSelector, createSelector } from '@ngrx/store';
import { HubType, IOType } from '@nvsukhanov/rxpoweredup';
import { Dictionary } from '@ngrx/entity';

import {
    AttachedIO,
    ControlScheme,
    ControlSchemeBinding,
    Controller,
    HubConfiguration,
    HubConnection,
    HubConnectionState,
    HubIoSupportedModes,
    IState,
    PortModeInfo
} from '../i-state';
import { CONTROL_SCHEMES_ENTITY_ADAPTER, controllerInputIdFn, hubAttachedIosIdFn } from '../entity-adapters';
import { HUB_PORT_TASKS_SELECTORS } from './hub-port-tasks.selectors';
import { HUB_ATTACHED_IO_SELECTORS, getHubIOOperationModes } from './hub-attached-io.selectors';
import { HUB_IO_SUPPORTED_MODES_SELECTORS } from './hub-io-supported-modes.selectors';
import { HUB_PORT_MODE_INFO_SELECTORS } from './hub-port-mode-info.selectors';
import { CONTROL_SCHEME_RUNNING_STATE_SELECTORS } from './control-scheme-running-state.selectors';
import { ROUTER_SELECTORS } from './router.selectors';
import { CONTROLLER_SELECTORS } from './controllers.selectors';
import { CONTROLLER_INPUT_SELECTORS } from './controller-input.selectors';
import { HUB_CONNECTION_SELECTORS } from './hub-connections.selectors';
import { HubIoOperationMode } from '../hub-io-operation-mode';
import { HUBS_SELECTORS } from './hubs.selectors';
import { ControllerInputType } from '../controller-input-type';

const CONTROL_SCHEME_FEATURE_SELECTOR = createFeatureSelector<IState['controlSchemes']>('controlSchemes');

const CONTROL_SCHEME_ENTITY_SELECTORS = CONTROL_SCHEMES_ENTITY_ADAPTER.getSelectors();

const CONTROL_SCHEME_SELECT_ENTITIES = createSelector(
    CONTROL_SCHEME_FEATURE_SELECTOR,
    CONTROL_SCHEME_ENTITY_SELECTORS.selectEntities
);

const CONTROL_SCHEME_SELECT_ALL = createSelector(
    CONTROL_SCHEME_FEATURE_SELECTOR,
    CONTROL_SCHEME_ENTITY_SELECTORS.selectAll
);

export type SchemeValidationResult = {
    schemeMissing: boolean;
    anotherSchemeIsRunning: boolean;
    controllerIsMissing: boolean;
    hubMissing: boolean;
    ioMissing: boolean;
    ioCapabilitiesMismatch: boolean;
}

export type IOBindingValidationResults = {
    bindingId: string;
    controllerIsMissing: boolean;
    hubMissing: boolean;
    ioMissing: boolean;
    ioCapabilitiesMismatch: boolean;
};

export enum ControlSchemeNodeTypes {
    Hub = 'Hub',
    IO = 'IO',
    Binding = 'Binding',
    VirtualPort = 'Virtual port'
}

export type ControlSchemeViewBindingTreeNode = {
    readonly nodeType: ControlSchemeNodeTypes.Binding;
    readonly controller?: Controller;
    readonly inputId: string;
    readonly inputType: ControllerInputType;
    readonly isActive: boolean;
    readonly operationMode: HubIoOperationMode;
    readonly ioHasNoRequiredCapabilities: boolean;
    readonly children: [];
}

export type ControlSchemeViewIOTreeNode = {
    readonly nodeType: ControlSchemeNodeTypes.IO;
    readonly portId: number;
    readonly ioType: IOType | null;
    readonly isConnected: boolean;
    readonly children: ControlSchemeViewBindingTreeNode[];
}

export type ControlSchemeViewVirtualPortTreeNode = {
    readonly name: string;
    readonly nodeType: ControlSchemeNodeTypes.VirtualPort;
    readonly portIdA: number;
    readonly ioTypeA: IOType;
    readonly portAIOIsConnected: boolean;
    readonly portAActualIOType: IOType | null;
    readonly portIdB: number;
    readonly ioTypeB: IOType;
    readonly portBIOIsConnected: boolean;
    readonly portBActualIOType: IOType | null;
    readonly children: [];
}

export type ControlSchemeViewHubTreeNode = {
    readonly nodeType: ControlSchemeNodeTypes.Hub;
    readonly hubId: string;
    readonly name: string;
    readonly batteryLevel: number | null;
    readonly RSSI: number | null;
    readonly hubType: HubType;
    readonly isButtonPressed: boolean;
    readonly hasCommunication: boolean;
    readonly connectionState: HubConnectionState;
    readonly children: Array<ControlSchemeViewIOTreeNode | ControlSchemeViewVirtualPortTreeNode>;
};

export type HubWithSynchronizableIOs = {
    hubId: string;
    hubName: string;
    synchronizableIOs: AttachedIO[];
}

export type ControlSchemeViewTreeNode = ControlSchemeViewHubTreeNode
    | ControlSchemeViewIOTreeNode
    | ControlSchemeViewBindingTreeNode
    | ControlSchemeViewVirtualPortTreeNode;

export const CONTROL_SCHEME_SELECTORS = {
    selectAll: CONTROL_SCHEME_SELECT_ALL,
    selectEntities: createSelector(CONTROL_SCHEME_FEATURE_SELECTOR, CONTROL_SCHEME_ENTITY_SELECTORS.selectEntities),
    selectSchemesList: createSelector(
        CONTROL_SCHEME_SELECT_ALL,
        CONTROL_SCHEME_RUNNING_STATE_SELECTORS.selectRunningSchemeId,
        (
            schemes,
            runningSchemeId
        ) => {
            return schemes.map((scheme) => ({
                ...scheme,
                isRunning: scheme.id === runningSchemeId
            }));
        }
    ),
    selectSchemesCount: createSelector(CONTROL_SCHEME_FEATURE_SELECTOR, CONTROL_SCHEME_ENTITY_SELECTORS.selectTotal),
    selectScheme: (id: string) => createSelector(CONTROL_SCHEME_SELECT_ENTITIES, (state) => state[id]),
    selectSchemeBindingInputValue: (
        schemeId: string,
        binding: ControlSchemeBinding
    ) => createSelector(
        CONTROL_SCHEME_SELECTORS.selectScheme(schemeId),
        CONTROLLER_INPUT_SELECTORS.selectEntities,
        (scheme, inputEntities) => {
            if (!scheme || !inputEntities) {
                return 0;
            }
            const input = inputEntities[controllerInputIdFn(binding.input)];
            return input ? input.value : 0;
        }
    ),
    validateSchemeIOBindings: (schemeId: string) => createSelector(
        CONTROL_SCHEME_SELECTORS.selectScheme(schemeId),
        HUB_PORT_TASKS_SELECTORS.selectLastExecutedTasksEntities,
        HUB_ATTACHED_IO_SELECTORS.selectIOsEntities,
        HUB_IO_SUPPORTED_MODES_SELECTORS.selectIOSupportedModesEntities,
        HUB_PORT_MODE_INFO_SELECTORS.selectEntities,
        CONTROLLER_SELECTORS.selectEntities,
        HUB_CONNECTION_SELECTORS.selectEntities,
        (
            scheme,
            tasks,
            iosEntities,
            ioSupportedModesEntities,
            portModeInfoEntities,
            controllerEntities,
            connectionEntities
        ): IOBindingValidationResults[] => {
            if (scheme === undefined) {
                return [] as IOBindingValidationResults[];
            }

            return scheme.bindings.map((binding) => {
                const controller = controllerEntities[binding.input.controllerId];
                const bindingValidationResult: IOBindingValidationResults = {
                    bindingId: binding.id,
                    controllerIsMissing: !controller,
                    hubMissing: connectionEntities[binding.output.hubId]?.connectionState !== HubConnectionState.Connected,
                    ioMissing: true,
                    ioCapabilitiesMismatch: true
                };

                if (!bindingValidationResult.hubMissing) {
                    const io = iosEntities[hubAttachedIosIdFn(binding.output)];
                    if (io) {
                        bindingValidationResult.ioMissing = false;
                        const ioOperationModes = getHubIOOperationModes(
                            io,
                            ioSupportedModesEntities,
                            portModeInfoEntities,
                            binding.input.inputType
                        );
                        bindingValidationResult.ioCapabilitiesMismatch = !ioOperationModes.includes(binding.output.operationMode);
                    }
                }

                return bindingValidationResult;
            });
        }
    ),
    validateScheme: (schemeId: string) => createSelector(
        CONTROL_SCHEME_RUNNING_STATE_SELECTORS.selectRunningSchemeId,
        CONTROL_SCHEME_SELECTORS.selectScheme(schemeId),
        CONTROL_SCHEME_SELECTORS.validateSchemeIOBindings(schemeId),
        (
            alreadyRunningSchemeId,
            scheme,
            ioValidationResults
        ): SchemeValidationResult => {
            let canRunResultNegative: SchemeValidationResult = {
                schemeMissing: false,
                anotherSchemeIsRunning: false,
                controllerIsMissing: false,
                hubMissing: false,
                ioMissing: false,
                ioCapabilitiesMismatch: false,
            };

            if (alreadyRunningSchemeId !== null && alreadyRunningSchemeId !== schemeId) {
                canRunResultNegative.anotherSchemeIsRunning = true;
            }
            if (!scheme) {
                canRunResultNegative.schemeMissing = false;
            }

            canRunResultNegative = ioValidationResults.reduce((
                acc,
                cur
            ) => {
                acc.controllerIsMissing = acc.controllerIsMissing || cur.controllerIsMissing;
                acc.hubMissing = acc.hubMissing || cur.hubMissing;
                acc.ioMissing = acc.ioMissing || cur.ioMissing;
                acc.ioCapabilitiesMismatch = acc.ioCapabilitiesMismatch || cur.ioCapabilitiesMismatch;
                return acc;
            }, canRunResultNegative);

            return canRunResultNegative;
        }
    ),
    canRunScheme: (schemeId: string) => createSelector(
        CONTROL_SCHEME_SELECTORS.validateScheme(schemeId),
        CONTROL_SCHEME_RUNNING_STATE_SELECTORS.selectRunningSchemeId,
        (
            validationResult,
            runningSchemeId
        ): boolean => {
            return !Object.values(validationResult).some((v) => v) && runningSchemeId === null;
        }
    ),
    schemeViewTree: (schemeId: string) => createSelector(
        CONTROL_SCHEME_SELECTORS.selectScheme(schemeId),
        HUBS_SELECTORS.selectHubEntities,
        HUB_CONNECTION_SELECTORS.selectEntities,
        HUB_ATTACHED_IO_SELECTORS.selectIOsEntities,
        HUB_IO_SUPPORTED_MODES_SELECTORS.selectIOSupportedModesEntities,
        HUB_PORT_MODE_INFO_SELECTORS.selectEntities,
        CONTROLLER_SELECTORS.selectEntities,
        HUB_PORT_TASKS_SELECTORS.selectLastExecutedBindingIds,
        (
            scheme: ControlScheme | undefined,
            hubEntities: Dictionary<HubConfiguration>,
            connectionEntities: Dictionary<HubConnection>,
            IOs: Dictionary<AttachedIO>,
            ioSupportedModesEntities: Dictionary<HubIoSupportedModes>,
            portModeInfoEntities: Dictionary<PortModeInfo>,
            controllerEntities: Dictionary<Controller>,
            lastExecutedTasksBindingIds: ReadonlySet<string>
        ): ControlSchemeViewTreeNode[] => {
            if (!scheme) {
                return [];
            }
            const hubsViewMap = new Map<string, ControlSchemeViewHubTreeNode>();
            const hubIOsViewMap = new Map<string, ControlSchemeViewIOTreeNode>();

            function ensureHubNodeCreated(
                hubConfig: HubConfiguration
            ): ControlSchemeViewHubTreeNode {
                const existingHubNode = hubsViewMap.get(hubConfig.hubId);
                if (existingHubNode) {
                    return existingHubNode;
                }

                const connectionState = connectionEntities[hubConfig.hubId]?.connectionState ?? HubConnectionState.Disconnected;
                const newHubNode: ControlSchemeViewHubTreeNode = {
                    hubId: hubConfig.hubId,
                    name: hubConfig.name,
                    batteryLevel: hubConfig.batteryLevel,
                    RSSI: hubConfig.RSSI,
                    hubType: hubConfig.hubType,
                    isButtonPressed: hubConfig.isButtonPressed,
                    hasCommunication: hubConfig.hasCommunication,
                    nodeType: ControlSchemeNodeTypes.Hub,
                    connectionState,
                    children: []
                };
                hubsViewMap.set(hubConfig.hubId, newHubNode);
                return newHubNode;
            }

            [ ...scheme.virtualPorts ].sort((a, b) => a.portIdA - b.portIdA).forEach((virtualPort) => {
                const hubConfig = hubEntities[virtualPort.hubId];
                if (!hubConfig) {
                    return;
                }
                const hubNode = ensureHubNodeCreated(hubConfig);
                const portAIO = IOs[hubAttachedIosIdFn({ hubId: hubConfig.hubId, portId: virtualPort.portIdA })];
                const portAIOIsConnected = hubNode.connectionState === HubConnectionState.Connected && !!portAIO;
                const portBIO = IOs[hubAttachedIosIdFn({ hubId: hubConfig.hubId, portId: virtualPort.portIdB })];
                const portBIOIsConnected = hubNode.connectionState === HubConnectionState.Connected && !!portBIO;
                const virtualPortNode: ControlSchemeViewVirtualPortTreeNode = {
                    name: virtualPort.name,
                    nodeType: ControlSchemeNodeTypes.VirtualPort,
                    portIdA: virtualPort.portIdA,
                    portAIOIsConnected,
                    portAActualIOType: portAIOIsConnected ? portAIO?.ioType ?? null : null,
                    ioTypeA: virtualPort.ioAType,
                    portIdB: virtualPort.portIdB,
                    portBIOIsConnected,
                    ioTypeB: virtualPort.ioBType,
                    portBActualIOType: portBIOIsConnected ? portBIO?.ioType ?? null : null,
                    children: []
                };
                hubNode.children.push(virtualPortNode);
            });

            [ ...scheme.bindings ].sort((a, b) => a.output.portId - b.output.portId).forEach((binding) => {
                const hubConfig = hubEntities[binding.output.hubId];
                if (!hubConfig) {
                    return;
                }
                const hubTreeNode = ensureHubNodeCreated(hubConfig);

                let ioViewModel = hubIOsViewMap.get(hubAttachedIosIdFn(binding.output));
                const io = IOs[hubAttachedIosIdFn(binding.output)];
                if (!ioViewModel) {
                    ioViewModel = {
                        nodeType: ControlSchemeNodeTypes.IO,
                        portId: binding.output.portId,
                        ioType: io?.ioType ?? null,
                        isConnected: hubTreeNode.connectionState === HubConnectionState.Connected && !!io,
                        children: []
                    };
                    hubIOsViewMap.set(hubAttachedIosIdFn(binding.output), ioViewModel);
                    hubTreeNode.children.push(ioViewModel);
                }

                let ioHasNoRequiredCapabilities = false;
                if (io) {
                    const ioOperationModes = getHubIOOperationModes(
                        io,
                        ioSupportedModesEntities,
                        portModeInfoEntities,
                        binding.input.inputType
                    );
                    ioHasNoRequiredCapabilities = !ioOperationModes.includes(binding.output.operationMode);
                }

                const bindingViewModel: ControlSchemeViewBindingTreeNode = {
                    nodeType: ControlSchemeNodeTypes.Binding,
                    controller: controllerEntities[binding.input.controllerId],
                    inputId: binding.input.inputId,
                    inputType: binding.input.inputType,
                    isActive: lastExecutedTasksBindingIds.has(binding.id),
                    operationMode: binding.output.operationMode,
                    ioHasNoRequiredCapabilities,
                    children: []
                };
                ioViewModel.children.push(bindingViewModel);
            });
            return [ ...hubsViewMap.values() ];
        }
    ),
    isSchemeRunning: (schemeId: string) => createSelector(
        CONTROL_SCHEME_RUNNING_STATE_SELECTORS.selectRunningSchemeId,
        (runningSchemeId) => runningSchemeId === schemeId
    ),
    isCurrentControlSchemeRunning: createSelector(
        CONTROL_SCHEME_RUNNING_STATE_SELECTORS.selectRunningSchemeId,
        ROUTER_SELECTORS.selectRouteParam('id'),
        (
            runningSchemeId,
            schemeId
        ) => runningSchemeId !== null && runningSchemeId === schemeId
    ),
    selectHubsWithSynchronizableIOs: createSelector(
        HUBS_SELECTORS.selectHubEntities,
        HUB_ATTACHED_IO_SELECTORS.selectFullIOsInfo,
        (hubEntities, ios): HubWithSynchronizableIOs[] => {
            const hubWithSynchronizableIOsMap = new Map<string, HubWithSynchronizableIOs>();
            ios.filter((io) => io.synchronizable)
               .forEach((io) => {
                   const hub = hubEntities[io.hubId];
                   if (!hub) {
                       return;
                   }
                   const existing = hubWithSynchronizableIOsMap.get(io.hubId);
                   if (existing) {
                       existing.synchronizableIOs.push(io);
                   } else {
                       hubWithSynchronizableIOsMap.set(hub.hubId, {
                           hubId: hub.hubId,
                           hubName: hub.name,
                           synchronizableIOs: [ io ]
                       });
                   }
               });
            return [ ...hubWithSynchronizableIOsMap.values() ].filter((h) => h.synchronizableIOs.length > 1);
        }
    )
} as const;
