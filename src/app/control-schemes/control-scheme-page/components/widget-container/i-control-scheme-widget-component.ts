import { WidgetConfigModel } from '@app/store';

export interface IControlSchemeWidgetComponent<TConfig extends WidgetConfigModel> {
    set canBeDeleted(value: boolean);

    get canBeDeleted(): boolean;

    set canBeEdited(value: boolean);

    get canBeEdited(): boolean;

    set config(config: TConfig);

    get config(): TConfig;
}
