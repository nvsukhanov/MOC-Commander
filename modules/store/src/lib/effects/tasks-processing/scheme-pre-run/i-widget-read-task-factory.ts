import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { InjectionToken } from '@angular/core';

import { ControlSchemeWidgetsDataModel, WidgetConfigModel } from '../../../models';
import { HubStorageService } from '../../../hub-storage.service';

export interface IWidgetReadTaskFactory<TConfig extends WidgetConfigModel = WidgetConfigModel> {
    createReadTask(
        config: TConfig,
        store: Store,
        hubStorage: HubStorageService,
        schemeStop$: Observable<unknown>
    ): Observable<{ widgetId: number; data: ControlSchemeWidgetsDataModel }>;
}

export const WIDGET_READ_TASK_FACTORY = new InjectionToken<IWidgetReadTaskFactory>('WIDGET_READ_TASK_FACTORY');
