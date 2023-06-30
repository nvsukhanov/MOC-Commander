/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { PortModeName } from '@nvsukhanov/rxpoweredup';
import { Dictionary } from '@ngrx/entity';

import { HUB_ATTACHED_IOS_ENTITY_ADAPTER, hubAttachedIosIdFn, hubIoSupportedModesIdFn, hubPortModeInfoIdFn, } from '../entity-adapters';
import { AttachedIo, HubIoSupportedModes, IState, PortModeInfo } from '../i-state';
import { HUB_IO_SUPPORTED_MODES_SELECTORS } from './hub-io-supported-modes.selectors';
import { ControllerInputType, HUB_IO_CONTROL_METHODS, HubIoOperationMode } from '../../shared';
import { HUB_PORT_MODE_INFO_SELECTORS } from './hub-port-mode-info.selectors';
import { HUB_STATS_SELECTORS } from './hub-stats.selectors';

const SELECT_HUB_ATTACHED_IOS_FEATURE = createFeatureSelector<IState['hubAttachedIos']>('hubAttachedIos');

const HUB_ATTACHED_IOS_ADAPTER_SELECTORS = HUB_ATTACHED_IOS_ENTITY_ADAPTER.getSelectors();

const SELECT_ALL = createSelector(SELECT_HUB_ATTACHED_IOS_FEATURE, HUB_ATTACHED_IOS_ADAPTER_SELECTORS.selectAll);

function selectIosControllableByInputType(
    ios: AttachedIo[],
    supportedModes: Dictionary<HubIoSupportedModes>,
    portModeData: Dictionary<PortModeInfo>,
    inputType: ControllerInputType
): Array<{ ioConfig: AttachedIo, operationModes: HubIoOperationMode[] }> {
    const applicablePortModes: Set<PortModeName> = new Set(Object.values(HUB_IO_CONTROL_METHODS[inputType]));
    const result: Array<{ ioConfig: AttachedIo, operationModes: HubIoOperationMode[] }> = [];
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

function combineFullIoInfo(
    ios: AttachedIo[],
    supportedModesEntities: Dictionary<HubIoSupportedModes>,
    portModeDataEntities: Dictionary<PortModeInfo>
): IoFullInfo[] {
    return ios.map((io) => {
        const supportedModesEntityId = hubIoSupportedModesIdFn(io);
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

export type IoFullInfo = {
    portInputModes: PortModeInfo[];
    portOutputModes: PortModeInfo[];
    synchronizable: boolean;
} & AttachedIo;

export const HUB_ATTACHED_IO_SELECTORS = {
    selectIosAll: SELECT_ALL,
    selectIosEntities: createSelector(SELECT_HUB_ATTACHED_IOS_FEATURE, HUB_ATTACHED_IOS_ADAPTER_SELECTORS.selectEntities),
    selectHubIos: (hubId: string) => createSelector(
        HUB_ATTACHED_IO_SELECTORS.selectIosAll,
        (ios) => ios.filter((io) => io.hubId === hubId)
    ),
    selectFullIosInfoForHub: (hubId: string) => createSelector(
        HUB_ATTACHED_IO_SELECTORS.selectHubIos(hubId),
        HUB_IO_SUPPORTED_MODES_SELECTORS.selectIoSupportedModesEntities,
        HUB_PORT_MODE_INFO_SELECTORS.selectEntities,
        (ios, supportedModesEntities, portModeDataEntities): IoFullInfo[] => {
            return combineFullIoInfo(ios, supportedModesEntities, portModeDataEntities);
        }
    ),
    selectFullIosInfo: createSelector(
        SELECT_ALL,
        HUB_IO_SUPPORTED_MODES_SELECTORS.selectIoSupportedModesEntities,
        HUB_PORT_MODE_INFO_SELECTORS.selectEntities,
        (ios, supportedModesEntities, portModeDataEntities): IoFullInfo[] => {
            return combineFullIoInfo(ios, supportedModesEntities, portModeDataEntities);
        }
    ),
    selectIoAtPort: (data: { hubId: string, portId: number }) => createSelector(
        HUB_ATTACHED_IO_SELECTORS.selectIosEntities,
        (ios) => ios[hubAttachedIosIdFn(data)]
    ),
    selectFirstIiControllableByInputType: (inputType: ControllerInputType) => createSelector(
        HUB_ATTACHED_IO_SELECTORS.selectIosAll,
        HUB_IO_SUPPORTED_MODES_SELECTORS.selectIoSupportedModesEntities,
        HUB_PORT_MODE_INFO_SELECTORS.selectEntities,
        (ios, supportedModes, portModeData) => selectIosControllableByInputType(ios, supportedModes, portModeData, inputType)
    ),
    selectHubIosControllableByInputType: (hubId: string, inputType: ControllerInputType) => createSelector(
        HUB_ATTACHED_IO_SELECTORS.selectHubIos(hubId),
        HUB_IO_SUPPORTED_MODES_SELECTORS.selectIoSupportedModesEntities,
        HUB_PORT_MODE_INFO_SELECTORS.selectEntities,
        (ios, supportedModes, portModeData) => selectIosControllableByInputType(ios, supportedModes, portModeData, inputType)
    ),
    selectHubIoOperationModes: (
        hubId: string,
        portId: number,
        inputType: ControllerInputType
    ) => createSelector(
        HUB_ATTACHED_IO_SELECTORS.selectIoAtPort({ hubId, portId }),
        HUB_IO_SUPPORTED_MODES_SELECTORS.selectIoSupportedModesEntities,
        HUB_PORT_MODE_INFO_SELECTORS.selectEntities,
        (io, supportedModes, portModeData) => {
            if (io) {
                return getHubIoOperationModes(io, supportedModes, portModeData, inputType);
            }
            return [];
        }
    ),
    selectHubPortInputModeForPortModeName: (hubId: string, portId: number, portModeName: PortModeName) => createSelector(
        HUB_ATTACHED_IO_SELECTORS.selectIoAtPort({ hubId, portId }),
        HUB_IO_SUPPORTED_MODES_SELECTORS.selectIoSupportedModesEntities,
        HUB_PORT_MODE_INFO_SELECTORS.selectEntities,
        (io, supportedModes, portModeData) => {
            if (io) {
                const supportedInputModes = new Set(
                    supportedModes[hubIoSupportedModesIdFn(io)]?.portInputModes ?? []
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
        HUB_ATTACHED_IO_SELECTORS.selectIoAtPort({ hubId, portId }),
        HUB_IO_SUPPORTED_MODES_SELECTORS.selectIoSupportedModesEntities,
        HUB_PORT_MODE_INFO_SELECTORS.selectEntities,
        (isHubConnected, io, supportedModesEntities, portModesEntities) => {
            if (!io || !isHubConnected) {
                return false;
            }
            const modesInfo: HubIoSupportedModes | undefined =
                supportedModesEntities[hubIoSupportedModesIdFn(io)];
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
    )
} as const;

export function getHubIoOperationModes(
    io: AttachedIo,
    supportedModes: ReturnType<typeof HUB_IO_SUPPORTED_MODES_SELECTORS.selectIoSupportedModesEntities>,
    portModeData: ReturnType<typeof HUB_PORT_MODE_INFO_SELECTORS.selectEntities>,
    inputType: ControllerInputType
): HubIoOperationMode[] {
    const outputModes = supportedModes[hubIoSupportedModesIdFn(io)]?.portOutputModes;

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

