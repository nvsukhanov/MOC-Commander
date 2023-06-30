export type KeyboardSettingsModel = {
    controllerId: string;
    captureNonAlphaNumerics: boolean;
}

export type GamepadSettingsModel = {
    controllerId: string;
}

export type ControllerSettingsModel = KeyboardSettingsModel | GamepadSettingsModel;
