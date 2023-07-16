import { ControllerSettingsModel } from '@app/store';

export interface IControllerSettingsComponent<TSettings extends ControllerSettingsModel = ControllerSettingsModel> {
    loadSettings(
        settings: TSettings
    ): void;

    registerSettingsChangesFn(
        settingChanges: (settings: TSettings) => void
    ): void;
}
