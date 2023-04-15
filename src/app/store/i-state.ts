import { HubType, IOType, PortModeName, PortModeSymbol } from '../lego-hub';
import { EntityState } from '@ngrx/entity';
import { RouterState } from '@ngrx/router-store';

export interface IState {
    controlSchemes: EntityState<ControlScheme>;
    controlSchemeBindings: EntityState<ControlSchemeBinding>;
    controlSchemeConfigurationState: {
        isListening: boolean;
    };
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

export type ControlSchemeBinding = {
    id: string;
    schemeId: string;
    gamepadId: number | null;
    gamepadInputMethod: GamepadInputMethod;
    gamepadAxisId: number | null;
    gamepadButtonId: number | null;
}

export type ControlScheme = {
    id: string;
    index: number;
    name: string;
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
    hubType: HubType;
    isButtonPressed: boolean;
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

export enum GamepadInputMethod {
    Axis,
    Button
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

