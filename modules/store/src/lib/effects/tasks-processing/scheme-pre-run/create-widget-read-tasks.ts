import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import { CONTROL_SCHEME_WIDGETS_DATA_ACTIONS } from '../../../actions';
import { ControlSchemeModel } from '../../../models';
import { HubStorageService } from '../../../hub-storage.service';
import { IWidgetReadTaskFactory } from './i-widget-read-task-factory';

export function createWidgetReadTasks(
    scheme: ControlSchemeModel,
    hubStorage: HubStorageService,
    store: Store,
    schemeStop$: Observable<unknown>,
    widgetTaskFactory: IWidgetReadTaskFactory
): Array<Observable<unknown>> {
    const result: Array<Observable<unknown>> = [];
    for (const widgetConfig of scheme.widgets) {
        const readerTask = widgetTaskFactory.createReadTask(widgetConfig, store, hubStorage, schemeStop$);
        const obs = new Observable((subscriber) => {
            let initialValueReceived = false;
            readerTask.subscribe((taskData) => {
                if (!initialValueReceived) {
                    initialValueReceived = true;
                    subscriber.next(null);
                    subscriber.complete();
                }
                store.dispatch(CONTROL_SCHEME_WIDGETS_DATA_ACTIONS.updateWidgetData(taskData));
            });
        });

        result.push(obs);
    }
    return result;
}
