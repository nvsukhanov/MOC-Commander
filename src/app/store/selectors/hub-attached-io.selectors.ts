/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { IOType, PortModeName } from '@nvsukhanov/rxpoweredup';
import { Dictionary } from '@ngrx/entity';

import { HUB_ATTACHED_IOS_ENTITY_ADAPTER, hubAttachedIosIdFn, hubIOSupportedModesIdFn, hubPortModeInfoIdFn, } from '../entity-adapters';
import { AttachedIO, HubIoSupportedModes, HubVirtualPortConfig, IState, PortModeInfo } from '../i-state';
import { HUB_IO_SUPPORTED_MODES_SELECTORS } from './hub-io-supported-modes.selectors';
import { HUB_IO_CONTROL_METHODS, HubIoOperationMode } from '../hub-io-operation-mode';
import { HUB_PORT_MODE_INFO_SELECTORS } from './hub-port-mode-info.selectors';
import { HUB_CONNECTION_SELECTORS } from './hub-connections.selectors';
import { ControllerInputType } from '../controller-input-type';
import { HUB_VIRTUAL_PORT_CONFIGS_SELECTORS } from './hub-virtual-port-configs.selectors';

const SELECT_HUB_ATTACHED_IOS_FEATURE = createFeatureSelector<IState['hubAttachedIOs']>('hubAttachedIOs');

const HUB_ATTACHED_IOS_ADAPTER_SELECTORS = HUB_ATTACHED_IOS_ENTITY_ADAPTER.getSelectors();

function selectIOsControllableByInputType(
    ios: AttachedIO[],
    supportedModes: Dictionary<HubIoSupportedModes>,
    portModeData: Dictionary<PortModeInfo>,
    inputType: ControllerInputType
): Array<{ ioConfig: AttachedIO, operationModes: HubIoOperationMode[] }> {
    const applicablePortModes: Set<PortModeName> = new Set(Object.values(HUB_IO_CONTROL_METHODS[inputType]));
    const result: Array<{ ioConfig: AttachedIO, operationModes: HubIoOperationMode[] }> = [];
    for (const io of ios) {
        const ioOperationModes = getHubIOOperationModes(io, supportedModes, portModeData, inputType)
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

export type IOFullInfo = {
    hubId: string;
    portId: number;
    ioType: IOType;
    hardwareRevision: string;
    softwareRevision: string;
    portInputModes: PortModeInfo[];
    portOutputModes: PortModeInfo[];
    synchronizable: boolean;
    virtualPort?: HubVirtualPortConfig;
}

export type VirtualPortConfigurationWithData = {
    hubId: string;
    name: string;
    portIdA: number;
    ioA?: AttachedIO;
    ioAExpectedType: IOType;
    ioAExpectedHardwareRevision: string;
    ioAExpectedSoftwareRevision: string;
    portIdB: number;
    ioB?: AttachedIO;
    ioBExpectedType: IOType;
    ioBExpectedHardwareRevision: string;
    ioBExpectedSoftwareRevision: string;
}

export const HUB_ATTACHED_IO_SELECTORS = {
    selectIOsAll: createSelector(SELECT_HUB_ATTACHED_IOS_FEATURE, HUB_ATTACHED_IOS_ADAPTER_SELECTORS.selectAll),
    selectIOsEntities: createSelector(SELECT_HUB_ATTACHED_IOS_FEATURE, HUB_ATTACHED_IOS_ADAPTER_SELECTORS.selectEntities),
    selectHubIOs: (hubId: string) => createSelector(
        HUB_ATTACHED_IO_SELECTORS.selectIOsAll,
        (ios) => ios.filter((io) => io.hubId === hubId)
    ),
    selectFullIOsInfo: (hubId: string) => createSelector(
        HUB_ATTACHED_IO_SELECTORS.selectHubIOs(hubId),
        HUB_IO_SUPPORTED_MODES_SELECTORS.selectIOSupportedModesEntities,
        HUB_PORT_MODE_INFO_SELECTORS.selectEntities,
        HUB_VIRTUAL_PORT_CONFIGS_SELECTORS.selectEntities,
        (ios, supportedModesEntities, portModeDataEntities, virtualPortsConfigurations): IOFullInfo[] => {
            return ios.map((io) => {
                const supportedModesEntityId = hubIOSupportedModesIdFn(io);
                const supportedModes: HubIoSupportedModes | undefined = supportedModesEntities[supportedModesEntityId];
                const portInputModeIds = supportedModes?.portInputModes ?? [];
                const portOutputModeIds = supportedModes?.portOutputModes ?? [];
                const portInputModes = portInputModeIds.map((modeId) => {
                    const modeEntityId = hubPortModeInfoIdFn({ ...io, modeId });
                    return portModeDataEntities[modeEntityId];
                }).filter((mode) => !!mode) as PortModeInfo[];
                const portOutputModes = portOutputModeIds.map((modeId) => {
                    const modeEntityId = hubPortModeInfoIdFn({ ...io, modeId });
                    return portModeDataEntities[modeEntityId];
                }).filter((mode) => !!mode) as PortModeInfo[];

                const virtualPort = Object.values(virtualPortsConfigurations)
                                          .find((config) => io.portId === config?.portIdA || io.portId === config?.portIdB);

                return {
                    hubId,
                    portId: io.portId,
                    ioType: io.ioType,
                    hardwareRevision: io.hardwareRevision,
                    softwareRevision: io.softwareRevision,
                    portInputModes,
                    portOutputModes,
                    synchronizable: supportedModes?.synchronizable ?? false,
                    virtualPort
                };
            });
        }
    ),
    selectMergeableIOs: ({ hubId }: { hubId: string }) => createSelector(
        HUB_ATTACHED_IO_SELECTORS.selectFullIOsInfo(hubId),
        (ios) => {
            return ios.filter((io) => io.synchronizable && !io.virtualPort);
        }
    ),
    countSynchronizableMergeableIOsCount: (hubId: string) => createSelector(
        HUB_ATTACHED_IO_SELECTORS.selectFullIOsInfo(hubId),
        (ios) => ios.filter((io) => io.synchronizable && !io.virtualPort).length
    ),
    selectIOAtPort: (data: { hubId: string, portId: number }) => createSelector(
        HUB_ATTACHED_IO_SELECTORS.selectIOsEntities,
        (ios) => ios[hubAttachedIosIdFn(data)]
    ),
    selectFirstIOControllableByInputType: (inputType: ControllerInputType) => createSelector(
        HUB_ATTACHED_IO_SELECTORS.selectIOsAll,
        HUB_IO_SUPPORTED_MODES_SELECTORS.selectIOSupportedModesEntities,
        HUB_PORT_MODE_INFO_SELECTORS.selectEntities,
        (ios, supportedModes, portModeData) => selectIOsControllableByInputType(ios, supportedModes, portModeData, inputType)
    ),
    selectHubIOsControllableByInputType: (hubId: string, inputType: ControllerInputType) => createSelector(
        HUB_ATTACHED_IO_SELECTORS.selectHubIOs(hubId),
        HUB_IO_SUPPORTED_MODES_SELECTORS.selectIOSupportedModesEntities,
        HUB_PORT_MODE_INFO_SELECTORS.selectEntities,
        (ios, supportedModes, portModeData) => selectIOsControllableByInputType(ios, supportedModes, portModeData, inputType)
    ),
    selectHubIOOperationModes: (
        hubId: string,
        portId: number,
        inputType: ControllerInputType
    ) => createSelector(
        HUB_ATTACHED_IO_SELECTORS.selectIOAtPort({ hubId, portId }),
        HUB_IO_SUPPORTED_MODES_SELECTORS.selectIOSupportedModesEntities,
        HUB_PORT_MODE_INFO_SELECTORS.selectEntities,
        (io, supportedModes, portModeData) => {
            if (io) {
                return getHubIOOperationModes(io, supportedModes, portModeData, inputType);
            }
            return [];
        }
    ),
    selectHubPortInputModeForPortModeName: (hubId: string, portId: number, portModeName: PortModeName) => createSelector(
        HUB_ATTACHED_IO_SELECTORS.selectIOAtPort({ hubId, portId }),
        HUB_IO_SUPPORTED_MODES_SELECTORS.selectIOSupportedModesEntities,
        HUB_PORT_MODE_INFO_SELECTORS.selectEntities,
        (io, supportedModes, portModeData) => {
            if (io) {
                const supportedInputModes = new Set(
                    supportedModes[hubIOSupportedModesIdFn(io)]?.portInputModes ?? []
                );
                if (supportedInputModes) {
                    return Object.values(portModeData).find((portModeInfo) => {
                        return portModeInfo?.name === portModeName && supportedInputModes.has(portModeInfo?.modeId);
                    }) ?? null;
                }
            }
            return null;
        }
    ),
    canCalibrateServo: ({ hubId, portId }: { hubId: string, portId: number }) => createSelector(
        HUB_CONNECTION_SELECTORS.selectIsHubConnected(hubId),
        HUB_ATTACHED_IO_SELECTORS.selectIOAtPort({ hubId, portId }),
        HUB_IO_SUPPORTED_MODES_SELECTORS.selectIOSupportedModesEntities,
        HUB_PORT_MODE_INFO_SELECTORS.selectEntities,
        (isHubConnected, io, supportedModesEntities, portModesEntities) => {
            if (!io || !isHubConnected) {
                return false;
            }
            const modesInfo: HubIoSupportedModes | undefined =
                supportedModesEntities[hubIOSupportedModesIdFn(io)];
            if (!modesInfo) {
                return false;
            }
            const portOutputModes = modesInfo.portOutputModes;
            const portModes = new Set(portOutputModes
                .map((modeId) => portModesEntities[hubPortModeInfoIdFn({ ...io, modeId })])
                .map((portModeInfo) => portModeInfo?.name)
                .filter((portModeInfo) => !!portModeInfo)
            ) as ReadonlySet<PortModeName>;

            return portModes.has(PortModeName.position) && portModes.has(PortModeName.absolutePosition);
        }
    ),
    selectVirtualPortsWithIOData: (hubId: string) => createSelector( // TODO: does not fit here, decompose into separate selectors
        HUB_VIRTUAL_PORT_CONFIGS_SELECTORS.selectAll,
        HUB_ATTACHED_IO_SELECTORS.selectIOsEntities,
        (virtualPortConfigurations, ios): VirtualPortConfigurationWithData[] => {
            return virtualPortConfigurations.map((virtualPortConfiguration) => {
                const ioA = ios[hubAttachedIosIdFn({ hubId, portId: virtualPortConfiguration.portIdA })];
                const ioB = ios[hubAttachedIosIdFn({ hubId, portId: virtualPortConfiguration.portIdB })];
                return {
                    hubId,
                    name: virtualPortConfiguration.name,
                    portIdA: virtualPortConfiguration.portIdA,
                    ioA,
                    ioAExpectedType: virtualPortConfiguration.ioAType,
                    ioAExpectedHardwareRevision: virtualPortConfiguration.ioAHardwareRevision,
                    ioAExpectedSoftwareRevision: virtualPortConfiguration.ioASoftwareRevision,
                    portIdB: virtualPortConfiguration.portIdB,
                    ioB,
                    ioBExpectedType: virtualPortConfiguration.ioBType,
                    ioBExpectedHardwareRevision: virtualPortConfiguration.ioBHardwareRevision,
                    ioBExpectedSoftwareRevision: virtualPortConfiguration.ioBSoftwareRevision,
                };
            });
        }
    )
} as const;

export function getHubIOOperationModes(
    io: AttachedIO,
    supportedModes: ReturnType<typeof HUB_IO_SUPPORTED_MODES_SELECTORS.selectIOSupportedModesEntities>,
    portModeData: ReturnType<typeof HUB_PORT_MODE_INFO_SELECTORS.selectEntities>,
    inputType: ControllerInputType
): HubIoOperationMode[] {
    const outputModes = supportedModes[hubIOSupportedModesIdFn(io)]?.portOutputModes;

    if (outputModes && outputModes.length > 0) {
        return outputModes.map((modeId) => {
            const portModeId = hubPortModeInfoIdFn({ ...io, modeId });
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
