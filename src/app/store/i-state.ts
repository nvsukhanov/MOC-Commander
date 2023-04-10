import { IOType, PortModeName, PortModeSymbol } from '../lego-hub';
import { EntityState } from '@ngrx/entity';

export interface IState {
    controller: {
        controllerType: ControllerType;
        connectionState: ControllerConnectionState;
        gamepadConfig: GamepadControllerConfig;
        controllerState: ControllerState;
    },
    hubs: EntityState<HubConfiguration>,
    hubAttachedIOs: EntityState<AttachedIOs>,
    hubPortInputModesByRevision: EntityState<PortInputModesByRevision>,
    hubIOdata: EntityState<HubIoValue>,
    hubPortModeInfo: EntityState<PortModeInfo>
    bluetoothAvailability: {
        isAvailable: boolean;
    }
}

export type PortInputModesByRevision = {
    hardwareRevision: string;
    softwareRevision: string;
    ioType: IOType;
    inputModes: number[];
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

export type AttachedIOs = {
    hubId: string;
    portId: number;
    ioType: IOType;
    hardwareRevision: string;
    softwareRevision: string;
}

export enum ControllerType {
    Unassigned,
    GamePad,
    Keyboard
}

export type ControllerButtonState = {
    readonly index: number;
    readonly value: number;
}

export type ControllerAxisState = {
    readonly index: number;
    readonly value: number;
}

export enum ControllerConnectionState {
    NotConnected,
    Listening,
    Connected
}

export type ControllerAxesState = {
    [index in number]: ControllerAxisState
};

export type ControllerButtonsState = {
    [index in number]: ControllerButtonState
};

export type ControllerState = {
    axes: ControllerAxesState;
    buttons: ControllerButtonsState;
}

export type GamepadButtonConfig = {
    index: number;
    nameL10nKey?: string;
}

export type GamepadButtonAxisConfig = {
    isButton: true;
    buttonIndex: number;
    nameL10nKey?: string;
}

export type GamepadNormalAxisConfig = {
    isButton: false;
    index: number;
    nameL10nKey?: string;
}

export type GamepadAxisConfig = GamepadButtonAxisConfig | GamepadNormalAxisConfig;

export type GamepadControllerConfig = {
    index: number | null;
    id: string;
    nameL10nKey?: string | null;
    axes: Array<GamepadAxisConfig>;
    buttons: Array<GamepadButtonConfig>;
}
