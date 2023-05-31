import { ControllerSettings } from '../../store';

export interface IControllerSettingsComponent<TSettings extends ControllerSettings = ControllerSettings> {
    loadSettings(
        settings: TSettings
    ): void;

    registerSettingsChangesFn(
        settingChanges: (settings: TSettings) => void
    ): void;
}
