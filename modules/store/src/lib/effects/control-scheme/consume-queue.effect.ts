import { Actions, createEffect, ofType } from '@ngrx/effects';
import { filter, map } from 'rxjs';
import { Store } from '@ngrx/store';
import { inject } from '@angular/core';
import { concatLatestFrom } from '@ngrx/operators';

import { PORT_TASKS_ACTIONS } from '../../actions';
import { PORT_TASKS_SELECTORS } from '../../selectors';
import { PortCommandTask } from '../../models';

export const CONSUME_QUEUE_EFFECT = createEffect((
    actions: Actions = inject(Actions),
    store: Store = inject(Store)
) => {
    return actions.pipe(
        ofType(PORT_TASKS_ACTIONS.setPendingTask, PORT_TASKS_ACTIONS.taskExecuted, PORT_TASKS_ACTIONS.taskExecutionFailed),
        map((action) => {
            switch (action.type) {
                case PORT_TASKS_ACTIONS.setPendingTask.type:
                    return { hubId: action.hubId, portId: action.portId };
                case PORT_TASKS_ACTIONS.taskExecuted.type:
                case PORT_TASKS_ACTIONS.taskExecutionFailed.type:
                    return { hubId: action.task.hubId, portId: action.task.portId };
            }
        }),
        concatLatestFrom(({ hubId, portId }) => store.select(PORT_TASKS_SELECTORS.selectRunningTask({ hubId, portId }))),
        filter(([ , runningTask ]) => !runningTask),
        concatLatestFrom(([ { hubId, portId } ]) => store.select(PORT_TASKS_SELECTORS.selectPendingTask({ hubId, portId }))),
        map(([ , task ]) => task),
        filter((task): task is PortCommandTask => !!task),
        map((task) => PORT_TASKS_ACTIONS.runTask({ task: task })),
    );
}, { functional: true });
