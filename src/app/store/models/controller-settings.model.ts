import { ControllerType } from '@app/shared';

import { GamepadSettings, HubControllerSettings, KeyboardSettings } from '../../controller-profiles';

export type KeyboardSettingsModel = {
    controllerId: string;
} & KeyboardSettings;

export type GamepadSettingsModel = {
    controllerId: string;
} & GamepadSettings;

export type HubControllerSettingsModel = {
    controllerId: string;
    controllerType: ControllerType.Hub;
} & HubControllerSettings;

export type ControllerSettingsModel = KeyboardSettingsModel | GamepadSettingsModel | HubControllerSettingsModel;
