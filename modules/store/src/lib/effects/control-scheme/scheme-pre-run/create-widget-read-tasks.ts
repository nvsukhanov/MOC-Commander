import { Observable, takeUntil } from 'rxjs';
import { Store } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';

import { CONTROL_SCHEME_ACTIONS, CONTROL_SCHEME_WIDGETS_DATA_ACTIONS } from '../../../actions';
import { ControlSchemeModel } from '../../../models';
import { IWidgetsReadTasksFactory } from './i-widgets-read-tasks-factory';

export function createWidgetReadTasks(
    scheme: ControlSchemeModel,
    store: Store,
    widgetTaskFactory: IWidgetsReadTasksFactory,
    actions: Actions
): Array<Observable<unknown>> {
    const result: Array<Observable<unknown>> = [];
    const readerTasks = widgetTaskFactory.createReadTasks(scheme.widgets);
    for (const task of readerTasks) {
        const obs = new Observable((subscriber) => {
            let initialValueReceived = false;
            task.pipe(
                takeUntil(actions.pipe(
                    ofType(
                        CONTROL_SCHEME_ACTIONS.stopScheme,
                        CONTROL_SCHEME_ACTIONS.schemeStartFailed
                    )
                ))
            ).subscribe((taskData) => {
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
