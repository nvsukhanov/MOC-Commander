import { Observable } from 'rxjs';
import { WidgetConfigModel } from '@app/store';

export interface IControlSchemeWidgetComponent<TConfig extends WidgetConfigModel> {
    readonly edit: Observable<void>;

    readonly delete: Observable<void>;

    canBeDeleted: boolean;

    canBeEdited: boolean;

    config: TConfig;
}
