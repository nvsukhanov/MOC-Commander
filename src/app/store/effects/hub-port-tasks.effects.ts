import { Injectable } from '@angular/core';
import { HUB_PORT_TASKS_ACTIONS } from '../actions/hub-port-tasks.actions';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { animationFrames, combineLatest, EMPTY, exhaustMap, filter, map, Observable, of, switchMap } from 'rxjs';
import {
    IPortCommandTaskComposer,
    ITaskExecutor,
    ITaskSuppressor,
    PortCommandTask,
    PortCommandTaskComposerFactoryService,
    TaskExecutorFactoryService,
    TaskQueueCompressor,
    TaskQueueCompressorFactoryService,
    TaskSuppressorFactory,
} from '../../control-scheme';
import { CONTROL_SCHEME_SELECTORS } from '../selectors';
import { Action, Store } from '@ngrx/store';
import { CONTROL_SCHEME_ACTIONS } from '../actions';
import { HUB_PORT_TASKS_SELECTORS } from '../selectors/hub-port-tasks.selectors';
import { HubStorageService } from '../hub-storage.service';
import { lastExecutedTaskIdFn } from '../entity-adapters';

@Injectable()
export class HubPortTasksEffects {
    public readonly clearTasksQueueOnSchemeRunningStop$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(CONTROL_SCHEME_ACTIONS.stopRunning),
            map(() => HUB_PORT_TASKS_ACTIONS.setQueue({ tasks: [] })),
        );
    });

    public readonly startComposingTasks$ = createEffect(() => { // TODO: seems too complicated
        return this.actions$.pipe(
            ofType(CONTROL_SCHEME_ACTIONS.runScheme),
            concatLatestFrom((action) => this.store.select(CONTROL_SCHEME_SELECTORS.selectScheme(action.schemeId))),
            switchMap(([ , scheme ]) => {
                if (scheme) {
                    return combineLatest([
                        of(scheme),
                        ...scheme.bindings.map((binding) => this.store.select(CONTROL_SCHEME_SELECTORS.selectSchemeBindingInputValue(scheme.id, binding)))
                    ]);
                }
                return EMPTY;
            }),
            map(([ scheme, ...bindingValues ]) => {
                const tasks = scheme.bindings.map((binding, index) => {
                    const value = bindingValues[index];
                    return this.taskComposer.composeTask(binding, value);
                });
                return tasks.filter((task) => !!task) as PortCommandTask[];
            }),
            concatLatestFrom(() => this.store.select(HUB_PORT_TASKS_SELECTORS.selectQueue)),
            concatLatestFrom(() => this.store.select(HUB_PORT_TASKS_SELECTORS.selectLastExecutedTasksEntities)),
            map(([ [ nextTasks, queue ], lastExecutedTasks ]) => {  // TODO: that seems really wrong
                const modelledQueue = [ ...queue ];

                // due to possible multiple control binding to a single port we need to compress the queue in order to eliminate
                // possible contradictions in the queue
                const compactedNextTasks = this.queueCompressor.compress(nextTasks);

                compactedNextTasks.forEach((nextTask) => {
                    const lastTaskOfKindInQueue = [ ...modelledQueue ].reverse().find((task) => task.taskType === nextTask.taskType);
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
                return [ queue, modelledQueue.slice(queue.length) ];
            }),
            filter(([ , newTasks ]) => newTasks.length > 0),
            map(([ queue, newTasks ]) => this.queueCompressor.compress([ ...queue, ...newTasks ])),
            map((queue) => HUB_PORT_TASKS_ACTIONS.setQueue({ tasks: queue })),
        ) as Observable<Action>;
    });

    public readonly pollTasks$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(CONTROL_SCHEME_ACTIONS.runScheme, CONTROL_SCHEME_ACTIONS.stopRunning),
            switchMap((a) => a.type === CONTROL_SCHEME_ACTIONS.runScheme.type
                             ? animationFrames()
                             : EMPTY
            ),
            concatLatestFrom(() => this.store.select(HUB_PORT_TASKS_SELECTORS.selectFirstTask)),
            map(([ , task ]) => task),
            filter((task) => !!task),
            exhaustMap((task) => {
                return this.taskExecutor.executeTask(task, this.hubStorage.get(task.hubId)).then(() => task);
            }),
            map((task) => HUB_PORT_TASKS_ACTIONS.markTaskAsExecuted({ task }))
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
}
