import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of } from 'rxjs';
import { inject } from '@angular/core';

import { HubStorageService } from '../../hub-storage.service';
import { PORT_TASKS_ACTIONS } from '../../actions';
import { ITaskRunner, TASK_RUNNER } from './i-task-runner';

export const EXECUTE_TASK_EFFECT = createEffect(
  (
    actions: Actions = inject(Actions),
    taskRunner: ITaskRunner = inject(TASK_RUNNER),
    hubStorage: HubStorageService = inject(HubStorageService),
  ) => {
    return actions.pipe(
      ofType(PORT_TASKS_ACTIONS.runTask),
      mergeMap((action) => {
        return taskRunner.runTask(hubStorage.get(action.task.hubId), action.task).pipe(
          map(() => PORT_TASKS_ACTIONS.taskExecuted({ task: action.task })),
          catchError(() => of(PORT_TASKS_ACTIONS.taskExecutionFailed({ task: action.task }))),
        );
      }),
    );
  },
  { functional: true },
);
