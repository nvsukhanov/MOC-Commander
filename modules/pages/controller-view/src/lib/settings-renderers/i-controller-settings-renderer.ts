import { Observable } from 'rxjs';
import { ControllerSettingsModel } from '@app/store';

export interface IControllerSettingsRenderer<TSettings extends ControllerSettingsModel = ControllerSettingsModel> {
  readonly settingsChanges$: Observable<TSettings>;

  loadSettings(settings: TSettings): void;
}
