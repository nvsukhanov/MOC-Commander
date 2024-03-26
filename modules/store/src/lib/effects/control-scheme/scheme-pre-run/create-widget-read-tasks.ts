import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import { CONTROL_SCHEME_WIDGETS_DATA_ACTIONS } from '../../../actions';
import { ControlSchemeModel } from '../../../models';
import { IWidgetsReadTasksFactory } from './i-widgets-read-tasks-factory';

export function createWidgetReadTasks(
    scheme: ControlSchemeModel,
    store: Store,
    widgetTaskFactory: IWidgetsReadTasksFactory
): Array<Observable<unknown>> {
    const result: Array<Observable<unknown>> = [];
    const readerTasks = widgetTaskFactory.createReadTasks(scheme.widgets);
    for (const task of readerTasks) {
        const obs = new Observable((subscriber) => {
            let initialValueReceived = false;
            task.subscribe((taskData) => {
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
