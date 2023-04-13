/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { AttachedIO, GamepadAxisState, GamepadButtonState, GamepadConfig, HubConfiguration, HubIoSupportedModes, HubIoValue, PortModeInfo } from './i-state';
import { IOType } from '../lego-hub';

export const HUB_ATTACHED_IOS_ENTITY_ADAPTER: EntityAdapter<AttachedIO> = createEntityAdapter<AttachedIO>({
    selectId: (io) => hubAttachedIosIdFn(io.hubId, io.portId),
    sortComparer: (a, b) => a.portId - b.portId
});

export function hubAttachedIosIdFn(hubId: string, portId: number) {
    return `${hubId}/${portId}`;
}

export const HUBS_ENTITY_ADAPTER: EntityAdapter<HubConfiguration> = createEntityAdapter<HubConfiguration>({
    selectId: (hub) => hub.hubId,
    sortComparer: (a, b) => a.hubId.localeCompare(b.hubId)
});

export const HUB_IO_DATA_ENTITY_ADAPTER: EntityAdapter<HubIoValue> = createEntityAdapter<HubIoValue>({
    selectId: (io) => hubIODataIdFn(io.hubId, io.portId),
});

export function hubIODataIdFn(hubId: string, portId: number) {
    return `${hubId}/${portId}`;
}

export const HUB_PORT_MODE_INFO: EntityAdapter<PortModeInfo> = createEntityAdapter<PortModeInfo>({
    selectId: (mode) => hubPortModeInfoIdFn(mode.hardwareRevision, mode.softwareRevision, mode.modeId, mode.ioType),
});

export function hubPortModeInfoIdFn(hardwareRevision: string, softwareRevision: string, modeId: number, ioType: IOType): string {
    return `${hardwareRevision}/${softwareRevision}/${modeId}/${ioType}`;
}

export const HUB_IO_SUPPORTED_MODES_ENTITY_ADAPTER: EntityAdapter<HubIoSupportedModes> = createEntityAdapter<HubIoSupportedModes>({
    selectId: (mode) => hubIOSupportedModesIdFn(mode.hardwareRevision, mode.softwareRevision, mode.ioType),
});

export function hubIOSupportedModesIdFn(hardwareRevision: string, softwareRevision: string, ioType: IOType): string {
    return `${hardwareRevision}/${softwareRevision}/${ioType}`;
}

export const GAMEPADS_ENTITY_ADAPTER: EntityAdapter<GamepadConfig> = createEntityAdapter<GamepadConfig>({
    selectId: (gamepad) => gamepad.gamepadIndex,
    sortComparer: (a, b) => a.gamepadIndex - b.gamepadIndex
});

export const GAMEPAD_AXES_STATES_ENTITY_ADAPTER: EntityAdapter<GamepadAxisState> = createEntityAdapter<GamepadAxisState>({
    selectId: (state) => gamepadAxisIdFn(state.gamepadIndex, state.axisIndex),
    sortComparer: (a, b) => a.axisIndex - b.axisIndex
});

export function gamepadAxisIdFn(gamepadIndex: number, axisIndex: number): string {
    return `${gamepadIndex}/${axisIndex}`;
}

export const GAMEPAD_BUTTONS_STATES_ENTITY_ADAPTER: EntityAdapter<GamepadButtonState> = createEntityAdapter<GamepadButtonState>({
    selectId: (state) => gamepadButtonIdFn(state.gamepadIndex, state.buttonIndex),
    sortComparer: (a, b) => a.buttonIndex - b.buttonIndex
});

export function gamepadButtonIdFn(gamepadIndex: number, buttonIndex: number): string {
    return `${gamepadIndex}/${buttonIndex}`;
}
