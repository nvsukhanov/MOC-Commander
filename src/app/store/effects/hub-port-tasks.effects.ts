import { Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { animationFrames, combineLatest, exhaustMap, filter, map, NEVER, of, switchMap, take } from 'rxjs';
import { CONTROL_SCHEME_SELECTORS, HUB_PORT_TASKS_SELECTORS } from '../selectors';
import { Store } from '@ngrx/store';
import { CONTROL_SCHEME_ACTIONS, HUB_PORT_TASKS_ACTIONS } from '../actions';
import {
    IPortCommandTaskComposer,
    ITaskExecutor,
    ITaskSuppressor,
    PortCommandTaskComposerFactoryService,
    TaskExecutorFactoryService,
    TaskQueueCompressor,
    TaskQueueCompressorFactoryService,
    TaskSuppressorFactory
} from '../../tasks-processing';
import { lastExecutedTaskIdFn } from '../entity-adapters';
import { PortCommandTask } from '../../common';
import { ControlSchemeBinding } from '../i-state';
import { Dictionary } from '@ngrx/entity';
import { HubStorageService } from '../hub-storage.service';

@Injectable()
export class HubPortTasksEffects {
    public readonly composeTasks$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(CONTROL_SCHEME_ACTIONS.runScheme, CONTROL_SCHEME_ACTIONS.stopRunning),
            switchMap((action) => action.type === CONTROL_SCHEME_ACTIONS.runScheme.type
                                  ? this.store.select(CONTROL_SCHEME_SELECTORS.selectScheme(action.schemeId))
                                  : of(null),
            ),
            switchMap((scheme) => {
                if (scheme) {
                    return combineLatest([
                        ...scheme.bindings.map((binding) => this.store.select(CONTROL_SCHEME_SELECTORS.selectSchemeBindingInputValue(scheme.id, binding)))
                    ]).pipe(
                        map((bindingValues) => ({ scheme, bindingValues }))
                    );
                }
                return NEVER;
            }),
            concatLatestFrom(() => this.store.select(HUB_PORT_TASKS_SELECTORS.selectLastExecutedTasksEntities)),
            map(([ { scheme, bindingValues }, lastExecutedTasksEntities ]) => {
                return {
                    lastExecutedTasksEntities,
                    tasks: this.composeTasks(scheme.bindings, bindingValues, lastExecutedTasksEntities)
                };
            }),
            concatLatestFrom(() => this.store.select(HUB_PORT_TASKS_SELECTORS.selectQueue)),
            map(([ { tasks, lastExecutedTasksEntities }, queue ]) => this.trimQueue(tasks, queue, lastExecutedTasksEntities)),
            map((queue) => HUB_PORT_TASKS_ACTIONS.setQueue({ tasks: queue })),
        );
    });

    public readonly pollTasks$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(CONTROL_SCHEME_ACTIONS.runScheme, CONTROL_SCHEME_ACTIONS.stopRunning),
            switchMap((a) => a.type === CONTROL_SCHEME_ACTIONS.runScheme.type
                             ? animationFrames() // TODO: replace with a meaningful scheduler
                             : NEVER
            ),
            concatLatestFrom(() => this.store.select(HUB_PORT_TASKS_SELECTORS.selectFirstTask)),
            map(([ , task ]) => task),
            filter((task) => !!task),
            exhaustMap((task) => this.taskExecutor.executeTask(task, this.hubStorage.get(task.hubId)).pipe(
                take(1),
                map(() => HUB_PORT_TASKS_ACTIONS.markTaskAsExecuted({ task })),
            ))
        );
    });

    private readonly taskComposer: IPortCommandTaskComposer;

    private readonly taskSuppressor: ITaskSuppressor;

    private readonly taskExecutor: ITaskExecutor;

    private readonly queueCompressor: TaskQueueCompressor;

    constructor(
        private readonly actions$: Actions,
        private readonly store: Store,
        private readonly hubStorage: HubStorageService,
        portCommandTaskComposerFactory: PortCommandTaskComposerFactoryService,
        taskSuppressorFactory: TaskSuppressorFactory,
        taskExecutorFactory: TaskExecutorFactoryService,
        queueCompresorFactory: TaskQueueCompressorFactoryService,
    ) {
        this.taskComposer = portCommandTaskComposerFactory.create();
        this.taskSuppressor = taskSuppressorFactory.create();
        this.taskExecutor = taskExecutorFactory.create();
        this.queueCompressor = queueCompresorFactory.create();
    }

    private composeTasks(
        bindings: ControlSchemeBinding[],
        bindingValues: number[],
        lastExecutedTasksEntities: Dictionary<PortCommandTask>
    ): PortCommandTask[] {
        return bindings.map((binding, index) => {
            const value = bindingValues[index];
            const lastExecutedBindingTask = lastExecutedTasksEntities[lastExecutedTaskIdFn(binding.output.hubId, binding.output.portId)];
            return this.taskComposer.composeTask(
                binding,
                value,
                lastExecutedBindingTask
            );
        }).filter((tasks) => !!tasks) as PortCommandTask[];
    }

    private trimQueue(
        nextTasks: PortCommandTask[],
        queue: PortCommandTask[],
        lastExecutedTasks: Dictionary<PortCommandTask>
    ): PortCommandTask[] {
        const modelledQueue = [ ...queue ];

        nextTasks.forEach((nextTask) => {
            const lastTaskOfKindInQueue = [ ...modelledQueue ].reverse().find((task) => task.taskType === nextTask.taskType
                && task.hubId === nextTask.hubId
                && task.portId === nextTask.portId
            );
            if (!lastTaskOfKindInQueue) {
                const lastExecutedCommandOfKind = lastExecutedTasks[lastExecutedTaskIdFn(nextTask.hubId, nextTask.portId)];
                if (!lastExecutedCommandOfKind
                    || lastExecutedCommandOfKind.taskType !== nextTask.taskType
                    || !this.taskSuppressor.shouldSuppressTask(nextTask, lastExecutedCommandOfKind)
                ) {
                    modelledQueue.push(nextTask);
                }
            } else if (!this.taskSuppressor.shouldSuppressTask(nextTask, lastTaskOfKindInQueue)) {
                modelledQueue.push(nextTask);
            }
        });

        return this.queueCompressor.compress(modelledQueue);
    }
}
