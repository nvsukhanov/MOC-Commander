import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Observable, catchError, filter, forkJoin, map, mergeMap, of, switchMap, take, timeout } from 'rxjs';
import { Action, Store } from '@ngrx/store';
import { inject } from '@angular/core';
import { Dictionary } from '@ngrx/entity';
import { concatLatestFrom } from '@ngrx/operators';
import { APP_CONFIG, IAppConfig } from '@app/shared-misc';

import { ITaskRunner, TASK_RUNNER } from './i-task-runner';
import { ITaskFactory, TASK_FACTORY } from './i-task-factory';
import { ATTACHED_IO_SELECTORS, CONTROL_SCHEME_SELECTORS, HUB_RUNTIME_DATA_SELECTORS, PORT_TASKS_SELECTORS } from '../../selectors';
import { AttachedIoModel, ControlSchemeBinding, ControlSchemeModel, PortCommandTask } from '../../models';
import { CONTROL_SCHEME_ACTIONS } from '../../actions';
import { HubStorageService } from '../../hub-storage.service';
import { attachedIosIdFn } from '../../reducers';

function getUniqueConnectedHubPorts(
  bindings: ControlSchemeBinding[],
  connectedHubIds: string[],
  attachedIos: Dictionary<AttachedIoModel>,
): Array<{ hubId: string; portId: number }> {
  const knownHubPortIds = new Set<string>();
  const result: Array<{ hubId: string; portId: number }> = [];
  for (const binding of bindings) {
    const ioIds = attachedIosIdFn(binding);
    if (knownHubPortIds.has(ioIds) || !connectedHubIds.includes(binding.hubId) || !attachedIos[attachedIosIdFn(binding)]) {
      continue;
    }
    result.push({ hubId: binding.hubId, portId: binding.portId });
    knownHubPortIds.add(ioIds);
  }
  return result;
}

function terminateScheme(
  schemeModel: ControlSchemeModel,
  store: Store,
  taskBuilder: ITaskFactory,
  hubStorage: HubStorageService,
  taskRunner: ITaskRunner,
  timeoutMs: number,
): Observable<Action> {
  return of(schemeModel).pipe(
    concatLatestFrom(() => [store.select(HUB_RUNTIME_DATA_SELECTORS.selectIds), store.select(ATTACHED_IO_SELECTORS.selectEntities)]),
    map(([scheme, connectedHubIds, attachedIos]) => getUniqueConnectedHubPorts(scheme.bindings, connectedHubIds, attachedIos)),
    map((uniquePortIds) => {
      if (uniquePortIds.length) {
        return uniquePortIds.map(({ hubId, portId }) => store.select(PORT_TASKS_SELECTORS.selectLastExecutedTask({ hubId, portId })).pipe(take(1)));
      }
      return [of(null)];
    }),
    switchMap((r) => forkJoin(r)),
    map((lastExecutedTasks) => {
      return lastExecutedTasks
        .filter((lastExecutedTask): lastExecutedTask is PortCommandTask => !!lastExecutedTask)
        .map((lastExecutedTask) => taskBuilder.buildCleanupTask(lastExecutedTask));
    }),
    map((cleanupTasks) => cleanupTasks.filter((cleanupTask: PortCommandTask | null): cleanupTask is PortCommandTask => !!cleanupTask)),
    switchMap((cleanupTasks: PortCommandTask[]) => {
      if (cleanupTasks.length === 0) {
        return of(CONTROL_SCHEME_ACTIONS.schemeStopped());
      }
      return forkJoin(cleanupTasks.map((task) => taskRunner.runTask(hubStorage.get(task.hubId), task))).pipe(
        timeout(timeoutMs),
        map(() => CONTROL_SCHEME_ACTIONS.schemeStopped()),
        catchError(() => of(CONTROL_SCHEME_ACTIONS.schemeStopped())),
      );
    }),
  );
}

export const STOP_SCHEME_EFFECT = createEffect(
  (
    actions: Actions = inject(Actions),
    store: Store = inject(Store),
    taskFactory: ITaskFactory = inject(TASK_FACTORY),
    taskRunner: ITaskRunner = inject(TASK_RUNNER),
    hubStorage: HubStorageService = inject(HubStorageService),
    appConfig: IAppConfig = inject(APP_CONFIG),
  ) => {
    return actions.pipe(
      ofType(CONTROL_SCHEME_ACTIONS.stopScheme),
      concatLatestFrom(() => store.select(CONTROL_SCHEME_SELECTORS.selectRunningScheme)),
      map(([, runningScheme]) => runningScheme),
      filter((runningScheme): runningScheme is ControlSchemeModel => !!runningScheme),
      mergeMap((runningScheme) => terminateScheme(runningScheme, store, taskFactory, hubStorage, taskRunner, appConfig.schemeStartStopTimeoutMs)),
    ) as Observable<Action>;
  },
  { functional: true },
);
