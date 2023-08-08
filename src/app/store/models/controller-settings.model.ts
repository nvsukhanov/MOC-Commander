import { GamepadSettings, KeyboardSettings } from '../../controller-profiles';

export type KeyboardSettingsModel = {
    controllerId: string;
} & KeyboardSettings;

export type GamepadSettingsModel = {
    controllerId: string;
} & GamepadSettings;

export type ControllerSettingsModel = KeyboardSettingsModel | GamepadSettingsModel;
