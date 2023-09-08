import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { map, mergeMap } from 'rxjs';
import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { HubStorageService, PORT_TASKS_ACTIONS, PORT_TASKS_SELECTORS } from '@app/store';

import { TaskRunnerService } from './task-runner';

export const EXECUTE_TASK_EFFECT = createEffect((
    actions: Actions = inject(Actions),
    store: Store = inject(Store),
    taskRunner: TaskRunnerService = inject(TaskRunnerService),
    hubStorage: HubStorageService = inject(HubStorageService)
) => {
    return actions.pipe(
        ofType(PORT_TASKS_ACTIONS.runTask),
        concatLatestFrom(({ task }) => store.select(PORT_TASKS_SELECTORS.selectLastExecutedTask(task))),
        mergeMap(([ action, lastExecutedTask ]) => {
            return taskRunner.runTask(
                hubStorage.get(action.task.hubId),
                action.task,
                lastExecutedTask ?? undefined
            ).pipe(
                map(() => PORT_TASKS_ACTIONS.taskExecuted({ task: action.task })),
            );
        }),
    );
}, { functional: true });
