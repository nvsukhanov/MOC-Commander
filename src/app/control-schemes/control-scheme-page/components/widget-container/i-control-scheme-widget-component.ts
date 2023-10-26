import { WidgetConfigModel } from '@app/store';

export interface IControlSchemeWidgetComponent<TConfig extends WidgetConfigModel> {
    set config(config: TConfig);

    get config(): TConfig;
}
