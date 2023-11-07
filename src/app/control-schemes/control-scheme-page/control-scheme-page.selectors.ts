import { Dictionary } from '@ngrx/entity';
import { HubType, PortModeName } from 'rxpoweredup';
import { createSelector } from '@ngrx/store';
import {
    ATTACHED_IO_MODES_SELECTORS,
    ATTACHED_IO_PORT_MODE_INFO_SELECTORS,
    ATTACHED_IO_SELECTORS,
    AttachedIoModel,
    AttachedIoPortModeInfoModel,
    CONTROLLER_CONNECTION_SELECTORS,
    CONTROL_SCHEME_SELECTORS,
    ControlSchemeBinding,
    ControlSchemeModel,
    ControlSchemeRunState,
    ControllerConnectionModel,
    HUBS_SELECTORS,
    HUB_RUNTIME_DATA_SELECTORS,
    HubModel,
    ROUTER_SELECTORS,
    WidgetConfigModel,
    attachedIoModesIdFn,
    attachedIoPortModeInfoIdFn,
    attachedIosIdFn
} from '@app/store';
import { WidgetType, getEnumValues } from '@app/shared';

import { areControllableIosPresent, getWidgetDataPortModeName, ioHasMatchingModeForOpMode } from '../common';
import {
    ControlSchemeNodeTypes,
    ControlSchemeViewBindingTreeNodeData,
    ControlSchemeViewHubTreeNode,
    ControlSchemeViewIoTreeNode,
    SchemeRunBlocker
} from './types';

function widgetHasIoAttached(
    widgetConfig: WidgetConfigModel,
    attachedIos: Dictionary<AttachedIoModel>
): boolean {
    switch (widgetConfig.widgetType) {
        case WidgetType.Voltage:
        case WidgetType.Tilt:
        case WidgetType.Temperature:
            return !!attachedIos[attachedIosIdFn(widgetConfig)];
    }
}

function getWidgetIoPortInputModes(
    widgetConfig: WidgetConfigModel,
    ioInputModes: Record<string, PortModeName[]>
): PortModeName[] {
    switch (widgetConfig.widgetType) {
        case WidgetType.Voltage:
        case WidgetType.Tilt:
        case WidgetType.Temperature:
            return ioInputModes[attachedIosIdFn(widgetConfig)] ?? [];
    }
}

function createHubTreeNode(
    hubConfig: { hubId: string; name?: string; hubType?: HubType },
): ControlSchemeViewHubTreeNode {
    return {
        path: hubConfig.hubId,
        hubId: hubConfig.hubId,
        nodeType: ControlSchemeNodeTypes.Hub,
        name: hubConfig.name ?? '',
        children: []
    };
}

function createIoTreeNode(
    parentPath: string,
    hubId: string,
    portId: number,
    bindings: ControlSchemeBinding[],
    schemeName: string,
): ControlSchemeViewIoTreeNode {
    return {
        path: `${parentPath}.${portId}`,
        nodeType: ControlSchemeNodeTypes.Io,
        portId: portId,
        hubId,
        schemeName,
        bindings,
        children: []
    };
}

function createBindingTreeNode(
    ioPath: string,
    binding: ControlSchemeBinding,
    schemeName: string,
    portOutputModeNames: PortModeName[],
    io?: AttachedIoModel,
): ControlSchemeViewBindingTreeNodeData {
    const ioHasNoRequiredCapabilities = io ?
                                        !ioHasMatchingModeForOpMode(binding.bindingType, portOutputModeNames)
                                           : true;
    return {
        path: `${ioPath}.${binding.id}`,
        nodeType: ControlSchemeNodeTypes.Binding,
        binding,
        schemeName,
        ioHasNoRequiredCapabilities,
        children: []
    };
}

const SELECT_CURRENTLY_VIEWED_SCHEME = createSelector(
    ROUTER_SELECTORS.selectCurrentlyViewedSchemeName,
    CONTROL_SCHEME_SELECTORS.selectEntities,
    (schemeName, schemes) => schemeName === null ? undefined : schemes[schemeName]
);

const SELECT_IO_MODES = createSelector(
    ATTACHED_IO_SELECTORS.selectAll,
    ATTACHED_IO_MODES_SELECTORS.selectEntities,
    ATTACHED_IO_PORT_MODE_INFO_SELECTORS.selectEntities,
    (ios, ioSupportedModesEntities, portModeInfoEntities): { input: Record<string, PortModeName[]>; output: Record<string, PortModeName[]> } => {
        const input: Record<string, PortModeName[]> = {};
        const output: Record<string, PortModeName[]> = {};
        for (const io of ios) {
            const ioId = attachedIosIdFn(io);
            output[ioId] = (ioSupportedModesEntities[attachedIoModesIdFn(io)]?.portOutputModes ?? []).map((modeId) => {
                const portModeInfo = portModeInfoEntities[attachedIoPortModeInfoIdFn({ ...io, modeId })];
                return portModeInfo?.name ?? null;
            }).filter((name): name is PortModeName => !!name);
            input[ioId] = (ioSupportedModesEntities[attachedIoModesIdFn(io)]?.portInputModes ?? []).map((modeId) => {
                const portModeInfo = portModeInfoEntities[attachedIoPortModeInfoIdFn({ ...io, modeId })];
                return portModeInfo?.name ?? null;
            }).filter((name): name is PortModeName => !!name);
        }
        return { input, output };
    }
);

const SELECT_SCHEME_RUN_BLOCKERS = createSelector(
    SELECT_CURRENTLY_VIEWED_SCHEME,
    CONTROL_SCHEME_SELECTORS.selectRunningState,
    HUB_RUNTIME_DATA_SELECTORS.selectIds,
    SELECT_IO_MODES,
    CONTROLLER_CONNECTION_SELECTORS.selectEntities,
    ATTACHED_IO_SELECTORS.selectEntities,
    (
        scheme: ControlSchemeModel | undefined,
        runningState: ControlSchemeRunState,
        connectedHubIds: string[],
        ioModes: { input: Record<string, PortModeName[]>; output: Record<string, PortModeName[]> },
        controllerConnections: Dictionary<ControllerConnectionModel>,
        attachedIos: Dictionary<AttachedIoModel>
    ): SchemeRunBlocker[] => {
        if (!scheme) {
            return [ SchemeRunBlocker.SchemeDoesNotExist ];
        }
        const result = new Set<SchemeRunBlocker>();

        if (runningState !== ControlSchemeRunState.Idle) {
            result.add(SchemeRunBlocker.AlreadyRunning);
        }
        if (!scheme.bindings.length) {
            result.add(SchemeRunBlocker.SchemeBindingsDoesNotExist);
        }

        if (scheme.bindings.some((b) => !connectedHubIds.includes(b.hubId))) {
            result.add(SchemeRunBlocker.SomeHubsAreNotConnected);
        }

        if (scheme.bindings.some((b) => !attachedIos[attachedIosIdFn(b)])) {
            result.add(SchemeRunBlocker.SomeIosAreNotConnected);
        }

        if (scheme.widgets.some((w) => !widgetHasIoAttached(w, attachedIos))) {
            result.add(SchemeRunBlocker.SomeIosAreNotConnected);
        }

        if (scheme.bindings.filter((b) => !!attachedIos[attachedIosIdFn(b)])
                  .some((b) => !ioHasMatchingModeForOpMode(b.bindingType, ioModes.output[attachedIosIdFn(b)] ?? []))
        ) {
            result.add(SchemeRunBlocker.SomeIosHaveNoRequiredCapabilities);
        }

        if (scheme.widgets.filter((w) => widgetHasIoAttached(w, attachedIos))
                  .some((widgetConfig) => !getWidgetDataPortModeName(widgetConfig.widgetType, getWidgetIoPortInputModes(widgetConfig, ioModes.input)))
        ) {
            result.add(SchemeRunBlocker.SomeIosHaveNoRequiredCapabilities);
        }

        if (scheme.bindings.some((b) => !Object.values(b.inputs).every((input) => !!controllerConnections[input.controllerId]))) {
            result.add(SchemeRunBlocker.SomeControllersAreNotConnected);
        }
        return [ ...result ];
    }
);

export type AddableWidgetData = {
    widgetType: WidgetType;
    hubId?: string;
    portId?: number;
    modeId?: number;
};

export const CONTROL_SCHEME_PAGE_SELECTORS = {
    selectCurrentlyViewedScheme: SELECT_CURRENTLY_VIEWED_SCHEME,
    selectIoOutputModes: SELECT_IO_MODES,
    schemeViewTree: createSelector(
        SELECT_CURRENTLY_VIEWED_SCHEME,
        HUBS_SELECTORS.selectEntities,
        ATTACHED_IO_SELECTORS.selectEntities,
        SELECT_IO_MODES,
        (
            scheme: ControlSchemeModel | undefined,
            hubEntities: Dictionary<HubModel>,
            iosEntities: Dictionary<AttachedIoModel>,
            ioModes: { input: Record<string, PortModeName[]>; output: Record<string, PortModeName[]> }
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
                        hubConfiguration
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
                        binding.portId,
                        scheme.bindings,
                        scheme.name
                    );
                    hubIosViewMap.set(ioId, ioViewModel);

                    hubTreeNode.children.push(ioViewModel);
                }

                const io = iosEntities[ioId];
                const bindingTreeNode = createBindingTreeNode(
                    ioViewModel.path,
                    binding,
                    scheme.name,
                    ioModes.output[ioId] ?? [],
                    io
                );

                ioViewModel.children.push(bindingTreeNode);
            });
            return [ ...hubsViewMap.values() ];
        }
    ),
    selectSchemeRunBlockers: SELECT_SCHEME_RUN_BLOCKERS,
    canRunViewedScheme: createSelector(
        SELECT_SCHEME_RUN_BLOCKERS,
        (blockers): boolean => {
            return blockers.length === 0;
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
        CONTROL_SCHEME_SELECTORS.selectIsAnySchemeRunning,
        (ios, ioSupportedModesEntities, portModeInfoEntities, isAnySchemeRunning) => {
            return !isAnySchemeRunning && areControllableIosPresent(ios, ioSupportedModesEntities, portModeInfoEntities);
        }
    ),
    canDeleteOrEditWidgets: createSelector(
        CONTROL_SCHEME_SELECTORS.selectRunningState,
        (runningState) => runningState === ControlSchemeRunState.Idle
    ),
    canExportViewedScheme: createSelector(
        SELECT_CURRENTLY_VIEWED_SCHEME,
        (scheme) => !!scheme && scheme.bindings.length > 0
    ),
    addableWidgetsData: (controlSchemeName: string) => createSelector(
        CONTROL_SCHEME_SELECTORS.selectScheme(controlSchemeName),
        ATTACHED_IO_SELECTORS.selectAll,
        ATTACHED_IO_MODES_SELECTORS.selectEntities,
        ATTACHED_IO_PORT_MODE_INFO_SELECTORS.selectEntities,
        (controlScheme, attachedIos, ioPortModes, portModesInfo): AddableWidgetData[] => {
            if (!controlScheme) {
                return [];
            }
            const widgetTypes: WidgetType[] = getEnumValues(WidgetType);
            const result: AddableWidgetData[] = [];

            // There are certain limitations on IO value reading: only one IO mode can be used at a time.
            // This means that if an IO is used for a widget, it cannot be re-used for another widget.
            // And if an IO is used for a binding, it also cannot be used for a widget due to output mode not strictly matching to input mode.

            const existingIoWidgetIds = new Set(controlScheme.widgets.map((widget) => attachedIosIdFn(widget)));
            const iosWithoutWidgets = attachedIos.filter((attachedIo) => !existingIoWidgetIds.has(attachedIosIdFn(attachedIo)));

            const controlledIosIds = new Set(controlScheme.bindings.map((binding) => attachedIosIdFn(binding)));
            const remainingIos = iosWithoutWidgets.filter((attachedIo) => !controlledIosIds.has(attachedIosIdFn(attachedIo)));

            for (const io of remainingIos) {
                const portInputModes = (ioPortModes[attachedIoModesIdFn(io)]?.portInputModes ?? []).map((modeId) => {
                    return portModesInfo[attachedIoPortModeInfoIdFn({ ...io, modeId })];
                }).filter((modeInfo): modeInfo is AttachedIoPortModeInfoModel => !!modeInfo);

                for (const widgetType of widgetTypes) {
                    const portModeName = getWidgetDataPortModeName(widgetType, portInputModes.map((info) => info.name));
                    if (!portModeName) {
                        continue;
                    }
                    const targetPortMode = portInputModes.find((info) => info.name === portModeName);
                    if (!targetPortMode) {
                        continue;
                    }
                    result.push({
                        widgetType,
                        hubId: io.hubId,
                        portId: io.portId,
                        modeId: targetPortMode.modeId
                    });
                }
            }
            return result;
        }
    ),
    canAddWidgets: (controlSchemeName: string) => createSelector(
        CONTROL_SCHEME_PAGE_SELECTORS.addableWidgetsData(controlSchemeName),
        CONTROL_SCHEME_SELECTORS.selectIsAnySchemeRunning,
        (addableWidgetsData, isAnySchemeRunning): boolean => {
            return !isAnySchemeRunning && addableWidgetsData.length > 0;
        }
    )
} as const;
