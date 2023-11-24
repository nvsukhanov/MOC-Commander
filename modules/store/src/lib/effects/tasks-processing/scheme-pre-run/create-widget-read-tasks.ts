import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { WidgetType } from '@app/shared-misc';

import { ControlSchemeModel } from '../../../models';
import { createTemperatureReaderTask, createTiltReaderTask, createVoltageReaderTask } from './widget-read-tasks';
import { HubStorageService } from '../../../hub-storage.service';

export function createWidgetReadTasks(
    scheme: ControlSchemeModel,
    hubStorage: HubStorageService,
    store: Store,
    schemeStop$: Observable<unknown>
): Array<Observable<unknown>> {
    const result: Array<Observable<unknown>> = [];
    for (const widgetConfig of scheme.widgets) {
        switch (widgetConfig.widgetType) {
            case WidgetType.Voltage:
                result.push(createVoltageReaderTask(widgetConfig, store, hubStorage, schemeStop$));
                break;
            case WidgetType.Tilt:
                result.push(createTiltReaderTask(widgetConfig, store, hubStorage, schemeStop$));
                break;
            case WidgetType.Temperature:
                result.push(createTemperatureReaderTask(widgetConfig, store, hubStorage, schemeStop$));
                break;
        }
    }
    return result;
}
