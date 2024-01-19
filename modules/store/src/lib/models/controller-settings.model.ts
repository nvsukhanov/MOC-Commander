import { ControllerType, GamepadSettings, HubControllerSettings, KeyboardSettings } from '@app/controller-profiles';

export type KeyboardSettingsModel = {
    controllerId: string;
    ignoreInput: boolean;
} & KeyboardSettings;

export type GamepadSettingsModel = {
    controllerId: string;
    ignoreInput: boolean;
} & GamepadSettings;

export type HubControllerSettingsModel = {
    controllerId: string;
    controllerType: ControllerType.Hub;
    ignoreInput: boolean;
} & HubControllerSettings;

export type ControllerSettingsModel = KeyboardSettingsModel | GamepadSettingsModel | HubControllerSettingsModel;
