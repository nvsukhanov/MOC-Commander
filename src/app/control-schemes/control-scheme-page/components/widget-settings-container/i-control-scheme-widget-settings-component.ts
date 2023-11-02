import { Observable } from 'rxjs';
import { WidgetConfigModel } from '@app/store';
import { DeepPartial } from '@app/shared';

export interface IControlSchemeWidgetSettingsComponent<T extends WidgetConfigModel> {
    readonly configChanges: Observable<T>;

    readonly valid: Observable<boolean>;

    readonly config: DeepPartial<T>;
    // useConfig(config: DeepPartial<T>): void;
}
