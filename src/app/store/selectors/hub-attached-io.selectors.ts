/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { HUB_ATTACHED_IOS_ENTITY_ADAPTER, hubAttachedIosIdFn, hubIOSupportedModesIdFn, hubPortModeInfoIdFn } from '../entity-adapters';
import { AttachedIO, GamepadInputMethod, HubIoSupportedModes, IState } from '../i-state';
import { HUB_IO_SUPPORTED_MODES_SELECTORS } from './hub-io-supported-modes.selectors';
import { HUB_IO_CONTROL_METHODS, HubIoOperationMode } from '../hub-io-operation-mode';
import { HUB_PORT_MODE_INFO_SELECTORS } from './hub-port-mode-info.selectors';
import { IOType, PortModeName } from '@nvsukhanov/rxpoweredup';

const SELECT_HUB_ATTACHED_IOS_FEATURE = createFeatureSelector<IState['hubAttachedIOs']>('hubAttachedIOs');

const HUB_ATTACHED_IOS_ADAPTER_SELECTORS = HUB_ATTACHED_IOS_ENTITY_ADAPTER.getSelectors();

export const HUB_ATTACHED_IO_SELECTORS = {
    selectIOsAll: createSelector(SELECT_HUB_ATTACHED_IOS_FEATURE, HUB_ATTACHED_IOS_ADAPTER_SELECTORS.selectAll),
    selectIOsEntities: createSelector(SELECT_HUB_ATTACHED_IOS_FEATURE, HUB_ATTACHED_IOS_ADAPTER_SELECTORS.selectEntities),
    selectHubIOs: (hubId: string) => createSelector(
        HUB_ATTACHED_IO_SELECTORS.selectIOsAll,
        (ios) => ios.filter((io) => io.hubId === hubId)
    ),
    selectIOAtPort: (hubId: string, portId: number) => createSelector(
        HUB_ATTACHED_IO_SELECTORS.selectIOsEntities,
        (ios) => ios[hubAttachedIosIdFn(hubId, portId)]
    ),
    selectIOsControllableByMethod: (hubId: string, inputMethod: GamepadInputMethod) => createSelector(
        HUB_ATTACHED_IO_SELECTORS.selectHubIOs(hubId),
        HUB_IO_SUPPORTED_MODES_SELECTORS.selectIOSupportedModesEntities,
        HUB_PORT_MODE_INFO_SELECTORS.selectEntities,
        (ios, supportedModes, portModeData) => {
            const applicablePortModes: Set<PortModeName> = new Set(Object.values(HUB_IO_CONTROL_METHODS[inputMethod]));
            const result: Array<{ ioConfig: AttachedIO, operationModes: HubIoOperationMode[] }> = [];
            for (const io of ios) {
                const ioOperationModes = getHubIOOperationModes(io, supportedModes, portModeData, inputMethod)
                    .filter((mode) => {
                        const portMode = HUB_IO_CONTROL_METHODS[inputMethod][mode];
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
    ),
    selectHubIOOperationModes: (hubId: string, portId: number, inputMethod: GamepadInputMethod) => createSelector(
        HUB_ATTACHED_IO_SELECTORS.selectIOAtPort(hubId, portId),
        HUB_IO_SUPPORTED_MODES_SELECTORS.selectIOSupportedModesEntities,
        HUB_PORT_MODE_INFO_SELECTORS.selectEntities,
        (io, supportedModes, portModeData) => {
            if (io) {
                return getHubIOOperationModes(io, supportedModes, portModeData, inputMethod);
            }
            return [];
        }
    ),
    selectHubPortInputModeForPortModeName: (hubId: string, portId: number, portModeName: PortModeName) => createSelector(
        HUB_ATTACHED_IO_SELECTORS.selectIOAtPort(hubId, portId),
        HUB_IO_SUPPORTED_MODES_SELECTORS.selectIOSupportedModesEntities,
        HUB_PORT_MODE_INFO_SELECTORS.selectEntities,
        (io, supportedModes, portModeData) => {
            if (io) {
                const supportedInputModes = new Set(
                    supportedModes[hubIOSupportedModesIdFn(io.hardwareRevision, io.softwareRevision, io.ioType)]?.portInputModes ?? []
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
    isIOAttached: (
        hubId: string,
        portId: number,
        ioType: IOType
    ) => createSelector(
        HUB_ATTACHED_IO_SELECTORS.selectIOAtPort(hubId, portId),
        (io) => {
            return io?.ioType === ioType;
        }
    ),
    canCalibrateServo: (
        hubId: string,
        portId: number,
    ) => createSelector(
        HUB_ATTACHED_IO_SELECTORS.selectIOAtPort(hubId, portId),
        HUB_IO_SUPPORTED_MODES_SELECTORS.selectIOSupportedModesEntities,
        HUB_PORT_MODE_INFO_SELECTORS.selectEntities,
        (io, supportedModesEntities, portModesEntities) => {
            if (!io) {
                return false;
            }
            const modesInfo: HubIoSupportedModes | undefined =
                supportedModesEntities[hubIOSupportedModesIdFn(io.hardwareRevision, io.softwareRevision, io.ioType)];
            if (!modesInfo) {
                return false;
            }
            const portOutputModes = modesInfo.portOutputModes;
            const portModes = new Set(portOutputModes
                .map((modeId) => portModesEntities[hubPortModeInfoIdFn(io.hardwareRevision, io.softwareRevision, modeId, io.ioType)])
                .map((portModeInfo) => portModeInfo?.name)
                .filter((portModeInfo) => !!portModeInfo)
            ) as ReadonlySet<PortModeName>;

            return portModes.has(PortModeName.position) && portModes.has(PortModeName.absolutePosition);
        }
    )
} as const;

export function getHubIOOperationModes(
    io: AttachedIO,
    supportedModes: ReturnType<typeof HUB_IO_SUPPORTED_MODES_SELECTORS.selectIOSupportedModesEntities>,
    portModeData: ReturnType<typeof HUB_PORT_MODE_INFO_SELECTORS.selectEntities>,
    inputMethod: GamepadInputMethod
): HubIoOperationMode[] {
    const outputModes = supportedModes[hubIOSupportedModesIdFn(io.hardwareRevision, io.softwareRevision, io.ioType)]?.portOutputModes;

    if (outputModes && outputModes.length > 0) {
        return outputModes.map((modeId) => {
            const portModeId = hubPortModeInfoIdFn(io.hardwareRevision, io.softwareRevision, modeId, io.ioType);
            const portModeInfo = portModeData[portModeId];
            if (portModeInfo && Object.values(HUB_IO_CONTROL_METHODS[inputMethod]).includes(portModeInfo.name)) {
                return Object.entries(HUB_IO_CONTROL_METHODS[inputMethod])
                             .filter(([ , modeName ]) => modeName === portModeInfo.name)
                             .map(([ operationMode ]) => operationMode as HubIoOperationMode);
            }
            return [];
        }).flat();
    }
    return [];
}
