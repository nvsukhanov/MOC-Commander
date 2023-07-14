import { Injectable } from '@angular/core';
import { Action, Store } from '@ngrx/store';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Observable, filter, from, map, mergeMap, switchMap, takeUntil } from 'rxjs';

import { CONTROLLER_INPUT_ACTIONS, CONTROL_SCHEME_ACTIONS, PORT_TASKS_ACTIONS } from '../../actions';
import { BindingTaskComposingData, CONTROL_SCHEME_SELECTORS, PORT_TASKS_SELECTORS } from '../../selectors';
import { ControlSchemeBinding, PortCommandTask } from '../../models';
import { attachedIosIdFn } from '../../reducers';
import { HubStorageService } from '../../hub-storage.service';
import { IPortCommandTaskBuilder, PortCommandTaskBuilderFactoryService } from './task-builder';
import { ITaskSuppressor, TaskSuppressorFactory } from './task-suppressor';
import { ITaskRunner, TaskRunnerFactoryService } from './task-runner';
import { ITaskQueueCompressor, TaskQueueCompressorFactoryService } from './task-queue-compressor';

@Injectable()
export class TaskProcessingEffects {
    public readonly composeTasks$ = createEffect(() => {
        return this.actions.pipe(
            ofType(CONTROL_SCHEME_ACTIONS.startScheme),
            concatLatestFrom((action) => this.store.select(CONTROL_SCHEME_SELECTORS.selectScheme(action.schemeId))),
            filter((scheme) => !!scheme),
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            switchMap(([ , scheme ]) => from(this.groupBindingsByHubsPortId(scheme!.bindings))),
            mergeMap((groupedBindings) => this.getTaskComposingData$(groupedBindings)),
            map((composingData) => ({
                hubId: composingData.hubId,
                portId: composingData.portId,
                queue: composingData.queue,
                tasks: this.composeTasksForBindingGroup(composingData)
            })),
            filter(({ tasks }) => tasks.length > 0),
            map((createdTasksData) => {
                const nonCompressedCombinedQueue = [ ...createdTasksData.queue, ...createdTasksData.tasks ];
                const compressedQueue = this.taskQueueCompressor.compress(nonCompressedCombinedQueue);
                const shouldUpdateQueue = compressedQueue.length !== createdTasksData.queue.length
                    || compressedQueue.some((task, index) => task.hash !== createdTasksData.queue[index]?.hash);
                return {
                    hubId: createdTasksData.hubId,
                    portId: createdTasksData.portId,
                    queue: compressedQueue,
                    shouldUpdateQueue
                };
            }),
            filter(({ shouldUpdateQueue }) => shouldUpdateQueue),
            map(({ hubId, portId, queue }) => PORT_TASKS_ACTIONS.updateQueue({ hubId, portId, queue }))
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
            filter(([ , taskToRun ]) => !!taskToRun),
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            map(([ , taskToRun ]) => PORT_TASKS_ACTIONS.runTask({ task: taskToRun! })),
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

    private taskBuilder: IPortCommandTaskBuilder;

    private readonly taskSuppressor: ITaskSuppressor;

    private readonly taskRunner: ITaskRunner;

    private readonly taskQueueCompressor: ITaskQueueCompressor;

    constructor(
        private readonly store: Store,
        private readonly actions: Actions,
        private readonly hubStorage: HubStorageService,
        portCommandTaskBuilderFactory: PortCommandTaskBuilderFactoryService,
        taskSuppressorFactory: TaskSuppressorFactory,
        taskRunnerFactory: TaskRunnerFactoryService,
        tasksQueueCompressorFactory: TaskQueueCompressorFactoryService
    ) {
        this.taskBuilder = portCommandTaskBuilderFactory.create();
        this.taskSuppressor = taskSuppressorFactory.create();
        this.taskRunner = taskRunnerFactory.create();
        this.taskQueueCompressor = tasksQueueCompressorFactory.create();
    }

    private groupBindingsByHubsPortId(
        bindings: ControlSchemeBinding[]
    ): Array<ControlSchemeBinding[]> {
        const bindingByHubPortId = new Map<string, ControlSchemeBinding[]>();
        for (const binding of bindings) {
            const hubPortId = attachedIosIdFn(binding.output);
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
                    hubId: bindingsGroup[0].output.hubId,
                    portId: bindingsGroup[0].output.portId,
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
        let previousTask: PortCommandTask | null = composingData.runningTask
            || composingData.lastExecutedTask
            || composingData.queue.at(-1)
            || null;

        for (const { value, binding } of composingData.bindingWithValue) {
            const task = this.taskBuilder.build(
                binding,
                value,
                composingData.encoderOffset,
                previousTask
            );
            if (task) {
                const shouldSuppress = this.taskSuppressor.shouldSuppressTask(
                    task,
                    previousTask
                );
                if (!shouldSuppress) {
                    result.push(task);
                    previousTask = task;
                }
            }
        }
        return result;
    }
}
