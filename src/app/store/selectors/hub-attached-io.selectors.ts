/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { PortModeName } from '@nvsukhanov/rxpoweredup';
import { Dictionary } from '@ngrx/entity';

import { HUB_ATTACHED_IOS_ENTITY_ADAPTER, hubAttachedIosIdFn, hubIOSupportedModesIdFn, hubPortModeInfoIdFn, } from '../entity-adapters';
import { AttachedIO, AttachedPhysicalIO, AttachedVirtualIO, HubIoSupportedModes, IState, PortModeInfo, PortType } from '../i-state';
import { HUB_IO_SUPPORTED_MODES_SELECTORS } from './hub-io-supported-modes.selectors';
import { HUB_IO_CONTROL_METHODS, HubIoOperationMode } from '../hub-io-operation-mode';
import { HUB_PORT_MODE_INFO_SELECTORS } from './hub-port-mode-info.selectors';
import { ControllerInputType } from '../controller-input-type';
import { HUB_STATS_SELECTORS } from './hub-stats.selectors';

const SELECT_HUB_ATTACHED_IOS_FEATURE = createFeatureSelector<IState['hubAttachedIOs']>('hubAttachedIOs');

const HUB_ATTACHED_IOS_ADAPTER_SELECTORS = HUB_ATTACHED_IOS_ENTITY_ADAPTER.getSelectors();

const SELECT_ALL = createSelector(SELECT_HUB_ATTACHED_IOS_FEATURE, HUB_ATTACHED_IOS_ADAPTER_SELECTORS.selectAll);

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

function combineFullIOInfo(
    ios: AttachedIO[],
    supportedModesEntities: Dictionary<HubIoSupportedModes>,
    portModeDataEntities: Dictionary<PortModeInfo>
): IOFullInfo[] {
    return ios.map((io) => {
        const supportedModesEntityId = hubIOSupportedModesIdFn(io);
        const supportedModes: HubIoSupportedModes | undefined = supportedModesEntities[supportedModesEntityId];
        const portInputModeIds = supportedModes?.portInputModes ?? [];
        const portOutputModeIds = supportedModes?.portOutputModes ?? [];
        const portInputModes = portInputModeIds.map((modeId) => {
            const modeEntityId = hubPortModeInfoIdFn({ io, modeId });
            return portModeDataEntities[modeEntityId];
        }).filter((mode) => !!mode) as PortModeInfo[];
        const portOutputModes = portOutputModeIds.map((modeId) => {
            const modeEntityId = hubPortModeInfoIdFn({ io, modeId });
            return portModeDataEntities[modeEntityId];
        }).filter((mode) => !!mode) as PortModeInfo[];

        return {
            ...io,
            portInputModes,
            portOutputModes,
            synchronizable: supportedModes?.synchronizable ?? false,
        };
    });
}

export type PhysicalIOFullInfo = {
    portInputModes: PortModeInfo[];
    portOutputModes: PortModeInfo[];
    synchronizable: boolean;
} & AttachedPhysicalIO;

export type VirtualIOFullInfo = {
    portInputModes: PortModeInfo[];
    portOutputModes: PortModeInfo[];
    synchronizable: boolean;
} & AttachedVirtualIO;

export type IOFullInfo = PhysicalIOFullInfo | VirtualIOFullInfo;

export const HUB_ATTACHED_IO_SELECTORS = {
    selectIOsAll: SELECT_ALL,
    selectIOsEntities: createSelector(SELECT_HUB_ATTACHED_IOS_FEATURE, HUB_ATTACHED_IOS_ADAPTER_SELECTORS.selectEntities),
    selectHubIOs: (hubId: string) => createSelector(
        HUB_ATTACHED_IO_SELECTORS.selectIOsAll,
        (ios) => ios.filter((io) => io.hubId === hubId)
    ),
    selectHubIOsByPortType: <T extends PortType>(portType: T) => createSelector(
        SELECT_ALL,
        (ios) => ios.filter((io) => io.portType === portType) as Array<AttachedIO & { portType: T }>
    ),
    selectFullPhysicalIOsInfoForHub: (hubId: string) => createSelector(
        HUB_ATTACHED_IO_SELECTORS.selectHubIOs(hubId),
        HUB_IO_SUPPORTED_MODES_SELECTORS.selectIOSupportedModesEntities,
        HUB_PORT_MODE_INFO_SELECTORS.selectEntities,
        (ios, supportedModesEntities, portModeDataEntities): PhysicalIOFullInfo[] => {
            return combineFullIOInfo(ios, supportedModesEntities, portModeDataEntities)
                .filter((v) => v.portType === PortType.Physical) as PhysicalIOFullInfo[];
        }
    ),
    selectFullIOsInfo: createSelector(
        SELECT_ALL,
        HUB_IO_SUPPORTED_MODES_SELECTORS.selectIOSupportedModesEntities,
        HUB_PORT_MODE_INFO_SELECTORS.selectEntities,
        (ios, supportedModesEntities, portModeDataEntities): IOFullInfo[] => {
            return combineFullIOInfo(ios, supportedModesEntities, portModeDataEntities);
        }
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
        HUB_STATS_SELECTORS.selectIsHubConnected(hubId),
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
                .map((modeId) => portModesEntities[hubPortModeInfoIdFn({ io, modeId })])
                .map((portModeInfo) => portModeInfo?.name)
                .filter((portModeInfo) => !!portModeInfo)
            ) as ReadonlySet<PortModeName>;

            return portModes.has(PortModeName.position) && portModes.has(PortModeName.absolutePosition);
        }
    ),
    selectHubVirtualPorts: (hubId: string) => createSelector(
        HUB_ATTACHED_IO_SELECTORS.selectHubIOs(hubId),
        (ios) => {
            return ios.filter((io) => io.portType === PortType.Virtual);
        }
    ),
    selectHubVirtualPortByABId: (
        { hubId, portIdA, portIdB }: { hubId: string, portIdA: number, portIdB: number }
    ) => createSelector(
        HUB_ATTACHED_IO_SELECTORS.selectHubVirtualPorts(hubId),
        (ios): AttachedVirtualIO => {
            return ios.find((io) => io.portType === PortType.Virtual && io.portIdA === portIdA && io.portIdB === portIdB) as AttachedVirtualIO;
        }
    ),
    virtualPortCanBeCreated: ({ hubId, portIdA, portIdB }: { hubId: string, portIdA: number, portIdB: number }) => createSelector(
        HUB_STATS_SELECTORS.selectIsHubConnected(hubId),
        HUB_ATTACHED_IO_SELECTORS.selectIOAtPort({ hubId, portId: portIdA }),
        HUB_ATTACHED_IO_SELECTORS.selectIOAtPort({ hubId, portId: portIdB }),
        HUB_ATTACHED_IO_SELECTORS.selectHubVirtualPortByABId({ hubId, portIdA, portIdB }),
        (isHubConnected, ioA, ioB, existingVirtualPort) => {
            return !!isHubConnected && !!ioA && !!ioB && !existingVirtualPort;
        }
    ),
    virtualPortCanBeDeleted: ({ hubId, portIdA, portIdB }: { hubId: string, portIdA: number, portIdB: number }) => createSelector(
        HUB_STATS_SELECTORS.selectIsHubConnected(hubId),
        HUB_ATTACHED_IO_SELECTORS.selectHubVirtualPortByABId({ hubId, portIdA, portIdB }),
        (isHubConnected, existingVirtualPort) => {
            return !!isHubConnected && !!existingVirtualPort;
        }
    ),
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
            const portModeId = hubPortModeInfoIdFn({ io, modeId });
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

