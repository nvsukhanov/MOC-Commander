import { Observable } from 'rxjs';
import { ControllerSettingsModel } from '@app/store';

export interface IControllerSettingsRenderer<TSettings extends ControllerSettingsModel = ControllerSettingsModel> {
    readonly canSave$: Observable<boolean>;

    loadSettings(
        settings: TSettings
    ): void;

    readSettings(): TSettings | undefined;
}
