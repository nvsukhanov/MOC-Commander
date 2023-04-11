/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import {
    AttachedIOs,
    GamepadAxisState,
    GamepadButtonState,
    GamepadConfig,
    HubConfiguration,
   HubIoOutputModes, HubIoValue,

    PortModeInfo
} from './i-state';
import { IOType } from '../lego-hub';

export const HUB_ATTACHED_IOS_ENTITY_ADAPTER: EntityAdapter<AttachedIOs> = createEntityAdapter<AttachedIOs>({
    selectId: (io) => hubAttachedIosIdFn(io.hubId, io.portId),
    sortComparer: (a, b) => a.portId - b.portId
});

export const hubAttachedIosIdFn = (hubId: string, portId: number) => `${hubId}/${portId}`;

export const HUBS_ENTITY_ADAPTER: EntityAdapter<HubConfiguration> = createEntityAdapter<HubConfiguration>({
    selectId: (hub) => hub.hubId,
    sortComparer: (a, b) => a.hubId.localeCompare(b.hubId)
});

export const HUB_IO_DATA_ENTITY_ADAPTER: EntityAdapter<HubIoValue> = createEntityAdapter<HubIoValue>({
    selectId: (io) => hubIODataIdFn(io.hubId, io.portId),
});

export const hubIODataIdFn = (hubId: string, portId: number) => `${hubId}/${portId}`;

export const HUB_PORT_MODE_INFO: EntityAdapter<PortModeInfo> = createEntityAdapter<PortModeInfo>({
    selectId: (mode) => hubPortModeInfoIdFn(mode.hardwareRevision, mode.softwareRevision, mode.modeId, mode.ioType),
});

export const hubPortModeInfoIdFn = (hardwareRevision: string, softwareRevision: string, modeId: number, ioType: IOType): string =>
    `${hardwareRevision}/${softwareRevision}/${modeId}/${ioType}`;

export const HUB_IO_OUTPUT_MODES_ENTITY_ADAPTER: EntityAdapter<HubIoOutputModes> = createEntityAdapter<HubIoOutputModes>({
    selectId: (mode) => hubIOOutputModesIdFn(mode.hardwareRevision, mode.softwareRevision, mode.ioType),
});

export const hubIOOutputModesIdFn = (hardwareRevision: string, softwareRevision: string, ioType: IOType) =>
    `${hardwareRevision}/${softwareRevision}/${ioType}`;

export const GAMEPADS_ENTITY_ADAPTER: EntityAdapter<GamepadConfig> = createEntityAdapter<GamepadConfig>({
    selectId: (gamepad) => gamepad.gamepadIndex,
    sortComparer: (a, b) => a.gamepadIndex - b.gamepadIndex
});

export const GAMEPAD_AXES_STATES_ENTITY_ADAPTER: EntityAdapter<GamepadAxisState> = createEntityAdapter<GamepadAxisState>({
    selectId: (state) => gamepadAxisIdFn(state.gamepadIndex, state.axisIndex),
    sortComparer: (a, b) => a.axisIndex - b.axisIndex
});

export const gamepadAxisIdFn = (gamepadIndex: number, axisIndex: number) => `${gamepadIndex}/${axisIndex}`;

export const GAMEPAD_BUTTONS_STATES_ENTITY_ADAPTER: EntityAdapter<GamepadButtonState> = createEntityAdapter<GamepadButtonState>({
    selectId: (state) => gamepadButtonIdFn(state.gamepadIndex, state.buttonIndex),
    sortComparer: (a, b) => a.buttonIndex - b.buttonIndex
});

export const gamepadButtonIdFn = (gamepadIndex: number, buttonIndex: number) => `${gamepadIndex}/${buttonIndex}`;
