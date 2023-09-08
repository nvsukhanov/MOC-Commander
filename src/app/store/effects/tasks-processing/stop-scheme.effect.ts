import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Observable, filter, forkJoin, map, of, switchMap, take } from 'rxjs';
import { Action, Store } from '@ngrx/store';
import { inject } from '@angular/core';
import { Dictionary } from '@ngrx/entity';
import {
    ATTACHED_IO_SELECTORS,
    AttachedIoModel,
    CONTROL_SCHEME_ACTIONS,
    CONTROL_SCHEME_SELECTORS,
    ControlSchemeBinding,
    ControlSchemeModel,
    HUB_STATS_SELECTORS,
    HubStorageService,
    PORT_TASKS_SELECTORS,
    PortCommandTask,
    attachedIosIdFn
} from '@app/store';

import { TaskFactoryService } from './task-factory';
import { TaskRunnerService } from './task-runner';

function getUniqueConnectedHubPorts(
    bindings: ControlSchemeBinding[],
    connectedHubIds: string[],
    attachedIos: Dictionary<AttachedIoModel>
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

export const STOP_SCHEME_EFFECT = createEffect((
    actions: Actions = inject(Actions),
    store: Store = inject(Store),
    taskBuilder: TaskFactoryService = inject(TaskFactoryService),
    taskRunner: TaskRunnerService = inject(TaskRunnerService),
    hubStorage: HubStorageService = inject(HubStorageService)
) => {
    return actions.pipe(
        ofType(CONTROL_SCHEME_ACTIONS.stopScheme),
        concatLatestFrom(() => store.select(CONTROL_SCHEME_SELECTORS.selectRunningScheme)),
        map(([ , runningScheme ]) => runningScheme),
        filter((runningScheme): runningScheme is ControlSchemeModel => !!runningScheme),
        concatLatestFrom(() => [
            store.select(HUB_STATS_SELECTORS.selectIds),
            store.select(ATTACHED_IO_SELECTORS.selectEntities)
        ]),
        map(([ scheme, connectedHubIds, attachedIos ]) => getUniqueConnectedHubPorts(scheme.bindings, connectedHubIds, attachedIos)),
        map((uniquePortIds) => {
            if (uniquePortIds.length) {
                return uniquePortIds.map(({ hubId, portId }) =>
                    store.select(PORT_TASKS_SELECTORS.selectLastExecutedTask({ hubId, portId })).pipe(take(1))
                );
            }
            return [ of(null) ];
        }),
        switchMap((r) => forkJoin(r)),
        map((lastExecutedTasks) => {
            return lastExecutedTasks
                .filter((lastExecutedTask): lastExecutedTask is PortCommandTask => !!lastExecutedTask)
                .map((lastExecutedTask) => taskBuilder.buildCleanupTask(lastExecutedTask));
        }),
        switchMap((tasks) => tasks.length ? forkJoin(tasks) : of([])),
        map((cleanupTasks) => cleanupTasks.filter((cleanupTask: PortCommandTask | null): cleanupTask is PortCommandTask => !!cleanupTask)),
        switchMap((cleanupTasks: PortCommandTask[]) => {
            return cleanupTasks.length === 0
                   ? of(null)
                   : forkJoin(cleanupTasks.map((task) => taskRunner.runTask(hubStorage.get(task.hubId), task)));
        }),
        map(() => CONTROL_SCHEME_ACTIONS.schemeStopped())
    ) as Observable<Action>;
}, { functional: true });
