import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Observable, filter, forkJoin, from, map, mergeMap, of, switchMap, takeUntil } from 'rxjs';
import { Action, Store } from '@ngrx/store';
import { inject } from '@angular/core';
import {
    BindingTaskComposingData,
    CONTROLLER_INPUT_ACTIONS,
    CONTROL_SCHEME_ACTIONS,
    CONTROL_SCHEME_SELECTORS,
    ControlSchemeBinding,
    ControlSchemeModel,
    PORT_TASKS_ACTIONS,
    PORT_TASKS_SELECTORS,
    PortCommandTask,
    attachedIosIdFn
} from '@app/store';

import { ITaskQueueCompressor, TASK_QUEUE_COMPRESSOR } from './i-task-queue-compressor';
import { taskFilter } from './task-filter';
import { TaskFactoryService } from './task-factory';

function groupBindingsByHubsPortId(
    bindings: ControlSchemeBinding[]
): Array<ControlSchemeBinding[]> {
    const bindingByHubPortId = new Map<string, ControlSchemeBinding[]>();
    for (const binding of bindings) {
        const hubPortId = attachedIosIdFn(binding);
        let hubBindings = bindingByHubPortId.get(hubPortId);
        if (!hubBindings) {
            hubBindings = [ binding ];
            bindingByHubPortId.set(hubPortId, hubBindings);
        } else {
            hubBindings.push(binding);
        }
    }
    return [ ...bindingByHubPortId.values() ];
}

function getTaskComposingData$(
    store: Store,
    actions: Actions,
    bindingsGroup: ControlSchemeBinding[]
): Observable<BindingTaskComposingData> {
    return actions.pipe(
        ofType(CONTROLLER_INPUT_ACTIONS.inputReceived),
        filter((a) => a.nextState.value !== a.prevValue),
        concatLatestFrom(() =>
            store.select(PORT_TASKS_SELECTORS.selectBindingTaskCreationModel({
                hubId: bindingsGroup[0].hubId,
                portId: bindingsGroup[0].portId,
                bindings: bindingsGroup
            }))
        ),
        map(([ , composingData ]) => composingData),
        takeUntil(actions.pipe(ofType(CONTROL_SCHEME_ACTIONS.stopScheme)))
    );
}

function composeTasksForBindingGroup(
    composingData: BindingTaskComposingData,
    taskBuilder: TaskFactoryService
): Observable<PortCommandTask[]> {
    const result: Array<Observable<PortCommandTask | null>> = [];
    const previousTask: PortCommandTask | null = composingData.runningTask
        || composingData.lastExecutedTask
        || composingData.queue.at(-1)
        || null;

    for (const binding of composingData.bindings) {
        result.push(taskBuilder.buildTask(
            binding,
            composingData.inputState,
            composingData.encoderOffset,
            previousTask
        ));
    }
    return forkJoin(result).pipe(
        map((tasks) => tasks.filter((task): task is PortCommandTask => !!task)),
        map((tasks) => tasks.sort((a, b) => a.inputTimestamp - b.inputTimestamp))
    );
}

function filterQueue(
    queue: PortCommandTask[],
    runningTask: PortCommandTask | null,
    lastExecutedTask: PortCommandTask | null
): PortCommandTask[] {
    let previousTask: PortCommandTask | null = runningTask || lastExecutedTask || null;
    const resultingQueue: PortCommandTask[] = new Array(queue.length);
    for (let i = 0; i < queue.length; i++) {
        const task = queue[i];
        if (taskFilter(task, previousTask)) {
            resultingQueue[i] = task;
            previousTask = task;
        }
    }
    return resultingQueue.filter((i) => !!i);
}

export const COMPOSE_TASKS_EFFECT = createEffect((
    actions: Actions = inject(Actions),
    store: Store = inject(Store),
    taskQueueCompressor: ITaskQueueCompressor = inject(TASK_QUEUE_COMPRESSOR),
    taskBuilder: TaskFactoryService = inject(TaskFactoryService)
) => {
    return actions.pipe(
        ofType(CONTROL_SCHEME_ACTIONS.schemeStarted, CONTROL_SCHEME_ACTIONS.stopScheme),
        switchMap((action) => action.type === CONTROL_SCHEME_ACTIONS.schemeStarted.type
                              ? store.select(CONTROL_SCHEME_SELECTORS.selectRunningScheme)
                              : of(null)
        ),
        filter((scheme): scheme is ControlSchemeModel => !!scheme),
        switchMap((scheme) => from(groupBindingsByHubsPortId(scheme.bindings))),
        mergeMap((groupedBindings) => getTaskComposingData$(store, actions, groupedBindings)),
        switchMap((composingData) => {
            return composeTasksForBindingGroup(composingData, taskBuilder).pipe(
                map((tasks) => ({ ...composingData, tasks }))
            );
        }),
        filter(({ tasks }) => tasks.length > 0),
        map(({ queue, tasks, lastExecutedTask, runningTask, portId, hubId }) => {
            const nonCompressedCombinedQueue = [ ...queue, ...tasks ];
            const compressedQueue = taskQueueCompressor.compress(nonCompressedCombinedQueue);
            const filteredQueue = filterQueue(compressedQueue, runningTask, lastExecutedTask);
            const shouldUpdateQueue = filteredQueue.length !== queue.length
                || filteredQueue.some((task, index) => task.hash !== queue[index]?.hash);
            return {
                hubId,
                portId,
                queue: filteredQueue,
                shouldUpdateQueue
            };
        }),
        filter(({ shouldUpdateQueue }) => shouldUpdateQueue),
        map(({ hubId, portId, queue }) => PORT_TASKS_ACTIONS.updateQueue({ hubId, portId, queue }))
    ) as Observable<Action>;
}, { functional: true });
