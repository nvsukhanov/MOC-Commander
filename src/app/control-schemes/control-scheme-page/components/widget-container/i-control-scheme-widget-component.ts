import { Observable } from 'rxjs';
import { WidgetConfigModel } from '@app/store';

export interface IControlSchemeWidgetComponent<TConfig extends WidgetConfigModel> {
    readonly edit: Observable<void>;

    readonly delete: Observable<void>;

    set canBeDeleted(value: boolean);

    get canBeDeleted(): boolean;

    set canBeEdited(value: boolean);

    get canBeEdited(): boolean;

    set config(config: TConfig);

    get config(): TConfig;
}
