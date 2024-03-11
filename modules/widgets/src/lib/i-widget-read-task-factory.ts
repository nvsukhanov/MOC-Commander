import { Observable } from 'rxjs';
import { ControlSchemeWidgetsDataModel, WidgetConfigModel } from '@app/store';

export interface IWidgetReadTaskFactory<TConfig extends WidgetConfigModel> {
    createReadTask(
        config: TConfig
    ): Observable<{ widgetId: number; data: ControlSchemeWidgetsDataModel }>;
}
