import { Observable } from 'rxjs';
import { InjectionToken } from '@angular/core';

import { ControlSchemeWidgetsDataModel, WidgetConfigModel } from '../../../models';

export interface IWidgetsReadTasksFactory<TConfig extends WidgetConfigModel = WidgetConfigModel> {
    createReadTasks(
        configs: TConfig[]
    ): Array<Observable<{ widgetId: number; data: ControlSchemeWidgetsDataModel }>>;
}

export const WIDGET_READ_TASKS_FACTORY = new InjectionToken<IWidgetsReadTasksFactory>('WIDGET_READ_TASK_FACTORY');
