import { IOType, PortModeName, PortModeSymbol } from '../lego-hub';
import { EntityState } from '@ngrx/entity';
import { RouterState } from '@ngrx/router-store';

export interface IState {
    gamepads: EntityState<GamepadConfig>;
    gamepadAxesState: EntityState<GamepadAxisState>;
    gamepadButtonsState: EntityState<GamepadButtonState>;
    hubs: EntityState<HubConfiguration>,
    hubAttachedIOs: EntityState<AttachedIO>,
    hubIOSupportedModes: EntityState<HubIoSupportedModes>,
    hubIOdata: EntityState<HubIoValue>,
    hubPortModeInfo: EntityState<PortModeInfo>
    bluetoothAvailability: {
        isAvailable: boolean;
    },
    router: RouterState;
}

export type HubIoSupportedModes = {
    hardwareRevision: string;
    softwareRevision: string;
    ioType: IOType;
    portInputModes: number[];
    portOutputModes: number[];
}

export type HubConfiguration = {
    hubId: string;
    name: string;
    batteryLevel: number | null;
    rssiLevel: number | null;
}

export type HubIoValue = {
    hubId: string;
    portId: number;
    modeId: number;
    values: number[];
}

export type PortModeInfo = {
    hardwareRevision: string;
    softwareRevision: string;
    modeId: number;
    ioType: IOType;
    name: PortModeName;
    symbol: PortModeSymbol;
}

export type AttachedIO = {
    hubId: string;
    portId: number;
    ioType: IOType;
    hardwareRevision: string;
    softwareRevision: string;
}

export type GamepadConfig = {
    gamepadIndex: number;
    name: string;
    nameL10nKey?: string;
    axes: Array<GamepadAxisConfig>;
    buttons: Array<GamepadButtonConfig>;
}

export type GamepadAxisState = {
    gamepadIndex: number;
    axisIndex: number;
    value: number;
}

export type GamepadButtonState = {
    gamepadIndex: number;
    buttonIndex: number;
    value: number;
}

export type GamepadAxisConfig = {
    index: number;
    nameL10nKey?: string;
}

export enum GamepadButtonType {
    Button,
    Trigger
}

export type GamepadButtonConfig = {
    index: number;
    buttonType: GamepadButtonType;
    nameL10nKey?: string;
}

