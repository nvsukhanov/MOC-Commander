import { Inject, Injectable } from '@angular/core';
import { Action, Store } from '@ngrx/store';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Observable, OperatorFunction, filter, forkJoin, from, map, mergeMap, of, switchMap, takeUntil } from 'rxjs';

import { CONTROLLER_INPUT_ACTIONS, CONTROL_SCHEME_ACTIONS, PORT_TASKS_ACTIONS } from '../../actions';
import { BindingTaskComposingData, CONTROL_SCHEME_SELECTORS, PORT_TASKS_SELECTORS } from '../../selectors';
import { ControlSchemeBinding, ControlSchemeModel, PortCommandTask } from '../../models';
import { attachedIosIdFn } from '../../reducers';
import { HubStorageService } from '../../hub-storage.service';
import { ITaskBuilder, TASK_BUILDER } from './i-task-builder';
import { ITaskQueueCompressor, TASK_QUEUE_COMPRESSOR } from './i-task-queue-compressor';
import { ITaskRunner, TASK_RUNNER } from './i-task-runner';
import { taskFilter } from './task-filter';

@Injectable()
export class TaskProcessingEffects {
    public readonly prepareSchemeRun$ = createEffect(() => {
        return this.actions.pipe(
            ofType(CONTROL_SCHEME_ACTIONS.startScheme),
            this.initializeScheme(),
            map((action) => CONTROL_SCHEME_ACTIONS.schemeStarted({ schemeId: action.schemeId }))
        );
    });

    public readonly composeTasks$ = createEffect(() => {
        return this.actions.pipe(
            ofType(CONTROL_SCHEME_ACTIONS.schemeStarted, CONTROL_SCHEME_ACTIONS.stopScheme),
            switchMap((action) => action.type === CONTROL_SCHEME_ACTIONS.schemeStarted.type
                                  ? this.store.select(CONTROL_SCHEME_SELECTORS.selectRunningScheme)
                                  : of(null)
            ),
            filter((scheme): scheme is ControlSchemeModel => !!scheme),
            switchMap((scheme) => from(this.groupBindingsByHubsPortId(scheme.bindings))),
            mergeMap((groupedBindings) => this.getTaskComposingData$(groupedBindings)),
            map((composingData) => ({
                hubId: composingData.hubId,
                portId: composingData.portId,
                queue: composingData.queue,
                tasks: this.composeTasksForBindingGroup(composingData),
                lastExecutedTask: composingData.lastExecutedTask,
                runningTask: composingData.runningTask
            })),
            filter(({ tasks }) => tasks.length > 0),
            map(({ queue, tasks, lastExecutedTask, runningTask, portId, hubId }) => {
                const nonCompressedCombinedQueue = [ ...queue, ...tasks ];
                const compressedQueue = this.taskQueueCompressor.compress(nonCompressedCombinedQueue);
                const filteredQueue = this.filterQueue(compressedQueue, runningTask, lastExecutedTask);
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
    });

    public readonly onSchemeStop$ = createEffect(() => {
        return this.actions.pipe(
            ofType(CONTROL_SCHEME_ACTIONS.stopScheme),
            concatLatestFrom(() => this.store.select(CONTROL_SCHEME_SELECTORS.selectRunningScheme)),
            map(([ , runningScheme ]) => runningScheme),
            filter((runningScheme): runningScheme is ControlSchemeModel => !!runningScheme),
            map((scheme) => this.getUniqueHubPorts(scheme.bindings)),
            concatLatestFrom((uniquePortIds) => uniquePortIds.map(({ hubId, portId }) =>
                this.store.select(PORT_TASKS_SELECTORS.selectLastExecutedTask({ hubId, portId })))
            ),
            map(([ , ...lastExecutedTasks ]) => {
                return lastExecutedTasks
                    .filter((lastExecutedTask): lastExecutedTask is PortCommandTask => !!lastExecutedTask)
                    .map((lastExecutedTask) => this.taskBuilder.buildCleanupTask(lastExecutedTask))
                    .filter((cleanupTask): cleanupTask is PortCommandTask => !!cleanupTask);
            }),
            switchMap((cleanupTasks) => cleanupTasks.length === 0
                                        ? of(null)
                                        : forkJoin(cleanupTasks.map((task) => this.taskRunner.runTask(task, this.hubStorage.get(task.hubId))))
            ),
            map(() => CONTROL_SCHEME_ACTIONS.schemeStopped())
        ) as Observable<Action>;
    });

    public readonly markTaskForRunning$ = createEffect(() => {
        return this.actions.pipe(
            ofType(PORT_TASKS_ACTIONS.updateQueue, PORT_TASKS_ACTIONS.taskExecuted),
            map((action) => {
                switch (action.type) {
                    case PORT_TASKS_ACTIONS.updateQueue.type:
                        return { hubId: action.hubId, portId: action.portId };
                    case PORT_TASKS_ACTIONS.taskExecuted.type:
                        return { hubId: action.task.hubId, portId: action.task.portId };
                }
            }),
            concatLatestFrom(({ hubId, portId }) => this.store.select(PORT_TASKS_SELECTORS.selectRunningTask({ hubId, portId }))),
            filter(([ , runningTask ]) => !runningTask),
            concatLatestFrom(([ { hubId, portId } ]) => this.store.select(PORT_TASKS_SELECTORS.selectFirstItemInQueue({ hubId, portId }))),
            map(([ , task ]) => task),
            filter((task): task is PortCommandTask => !!task),
            map((task) => PORT_TASKS_ACTIONS.runTask({ task: task })),
        );
    });

    public readonly executeTask$ = createEffect(() => {
        return this.actions.pipe(
            ofType(PORT_TASKS_ACTIONS.runTask),
            mergeMap((action) => this.taskRunner.runTask(action.task, this.hubStorage.get(action.task.hubId)).pipe(
                map(() => PORT_TASKS_ACTIONS.taskExecuted({ task: action.task })),
            )),
        );
    });

    constructor(
        private readonly store: Store,
        private readonly actions: Actions,
        private readonly hubStorage: HubStorageService,
        @Inject(TASK_BUILDER) private taskBuilder: ITaskBuilder,
        @Inject(TASK_RUNNER) private readonly taskRunner: ITaskRunner,
        @Inject(TASK_QUEUE_COMPRESSOR) private readonly taskQueueCompressor: ITaskQueueCompressor
    ) {
    }

    private initializeScheme(): OperatorFunction<{ schemeId: string }, { schemeId: string }> {
        return (source: Observable<{ schemeId: string }>) => source.pipe(
            concatLatestFrom(({ schemeId }) => this.store.select(CONTROL_SCHEME_SELECTORS.selectScheme(schemeId))),
            map(([ , scheme ]) => scheme),
            filter((scheme): scheme is ControlSchemeModel => !!scheme),
            switchMap((scheme) => {
                const setAccProfileTasks = scheme.portConfigs.filter((i) => i.useAccelerationProfile).map((i) => {
                    return this.hubStorage.get(i.hubId).motors.setAccelerationTime(i.portId, i.accelerationTimeMs);
                });
                const setDecProfileTasks = scheme.portConfigs.filter((i) => i.useDecelerationProfile).map((i) => {
                    return this.hubStorage.get(i.hubId).motors.setDecelerationTime(i.portId, i.decelerationTimeMs);
                });
                if (setAccProfileTasks.length === 0 && setDecProfileTasks.length === 0) {
                    return of({ schemeId: scheme.id });
                }
                return forkJoin([
                    ...setAccProfileTasks,
                    ...setDecProfileTasks
                ]).pipe(
                    map(() => ({ schemeId: scheme.id }))
                );
            })
        );
    }

    private getUniqueHubPorts(
        bindings: ControlSchemeBinding[]
    ): Array<{ hubId: string; portId: number }> {
        const knownHubPortIds = new Set<string>();
        const result: Array<{ hubId: string; portId: number }> = [];
        for (const binding of bindings) {
            const ioIds = attachedIosIdFn(binding);
            if (knownHubPortIds.has(ioIds)) {
                continue;
            }
            result.push({ hubId: binding.hubId, portId: binding.portId });
            knownHubPortIds.add(ioIds);
        }
        return result;
    }

    private groupBindingsByHubsPortId(
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

    private getTaskComposingData$(
        bindingsGroup: ControlSchemeBinding[]
    ): Observable<BindingTaskComposingData> {
        return this.actions.pipe(
            ofType(CONTROLLER_INPUT_ACTIONS.inputReceived),
            concatLatestFrom(() =>
                this.store.select(PORT_TASKS_SELECTORS.selectBindingTaskCreationModel({
                    hubId: bindingsGroup[0].hubId,
                    portId: bindingsGroup[0].portId,
                    bindings: bindingsGroup
                }))
            ),
            map(([ , composingData ]) => composingData),
            takeUntil(this.actions.pipe(ofType(CONTROL_SCHEME_ACTIONS.stopScheme)))
        );
    }

    private composeTasksForBindingGroup(
        composingData: BindingTaskComposingData
    ): PortCommandTask[] {
        const result: PortCommandTask[] = [];
        const previousTask: PortCommandTask | null = composingData.runningTask
            || composingData.lastExecutedTask
            || composingData.queue.at(-1)
            || null;

        for (const binding of composingData.bindings) {
            const task = this.taskBuilder.buildTask(
                binding,
                composingData.inputState,
                composingData.encoderOffset,
                previousTask
            );
            if (task) {
                result.push(task);
            }
        }
        return result.sort((a, b) => a.inputTimestamp - b.inputTimestamp);
    }

    private filterQueue(
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
}
