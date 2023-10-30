import { Observable } from 'rxjs';
import { WidgetConfigModel } from '@app/store';
import { DeepPartial } from '@app/shared';

export interface IControlSchemeWidgetSettingsComponent<T extends WidgetConfigModel> {
    readonly save: Observable<T>;

    readonly canSave$: Observable<boolean>;

    useConfig(config: DeepPartial<T>): void;

    getConfig(): T;
}
