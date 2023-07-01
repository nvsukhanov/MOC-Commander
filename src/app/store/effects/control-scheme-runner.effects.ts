import { Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { NEVER, TimeoutError, animationFrames, catchError, combineLatest, exhaustMap, filter, map, of, switchMap, take } from 'rxjs';
import { Store } from '@ngrx/store';
import { Dictionary } from '@ngrx/entity';
import { PortCommandExecutionStatus } from '@nvsukhanov/rxpoweredup';

import { CONTROL_SCHEME_SELECTORS, HUB_ATTACHED_IO_STATE_SELECTORS, HUB_PORT_TASKS_SELECTORS } from '../selectors';
import { CONTROL_SCHEME_ACTIONS, HUBS_ACTIONS, HUB_PORT_TASKS_ACTIONS } from '../actions';
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
import { HubStorageService } from '../hub-storage.service';
import { AttachedIoPropsModel, ControlSchemeBinding } from '../models';
import { attachedIosIdFn, lastExecutedTaskIdFn } from '../reducers';
import { PortCommandTask } from '@app/shared';

@Injectable()
export class ControlSchemeRunnerEffects {
    public readonly stopSchemeOnHubDisconnect$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(HUBS_ACTIONS.disconnected),
            concatLatestFrom(() => this.store.select(CONTROL_SCHEME_SELECTORS.selectRunningSchemeId)),
            filter(([ , schemeId ]) => schemeId !== null),
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            concatLatestFrom(([ , schemeId ]) => this.store.select(CONTROL_SCHEME_SELECTORS.selectScheme(schemeId!))),
            filter(([ [ action ], scheme ]) => !!scheme && scheme.bindings.some((binding) => binding.output.hubId === action.hubId)),
            map(() => CONTROL_SCHEME_ACTIONS.stopScheme())
        );
    });

    public readonly composeTasks$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(
                CONTROL_SCHEME_ACTIONS.startScheme,
                CONTROL_SCHEME_ACTIONS.startScheme,
            ),
            switchMap((action) => action.type === CONTROL_SCHEME_ACTIONS.startScheme.type
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
            concatLatestFrom(() => [
                this.store.select(HUB_PORT_TASKS_SELECTORS.selectLastExecutedTasksEntities),
                this.store.select(HUB_ATTACHED_IO_STATE_SELECTORS.selectEntities),
            ]),
            map(([ { scheme, bindingValues }, lastExecutedTasksEntities, ioStateEntities ]) => {
                return {
                    lastExecutedTasksEntities,
                    tasks: this.composeTasks(scheme.bindings, bindingValues, lastExecutedTasksEntities, ioStateEntities)
                };
            }),
            concatLatestFrom(() => this.store.select(HUB_PORT_TASKS_SELECTORS.selectQueue)),
            map(([ { tasks, lastExecutedTasksEntities }, queue ]) => this.trimQueue(tasks, queue, lastExecutedTasksEntities)),
            map((queue) => HUB_PORT_TASKS_ACTIONS.setQueue({ tasks: queue })),
        );
    });

    public readonly pollTasks$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(
                CONTROL_SCHEME_ACTIONS.startScheme,
                CONTROL_SCHEME_ACTIONS.stopScheme,
            ),
            switchMap((a) => a.type === CONTROL_SCHEME_ACTIONS.startScheme.type
                             ? animationFrames() // TODO: replace with a meaningful scheduler
                             : NEVER
            ),
            concatLatestFrom(() => this.store.select(HUB_PORT_TASKS_SELECTORS.selectFirstTask)),
            map(([ , task ]) => task),
            filter((task) => !!task),
            exhaustMap((task) => this.taskExecutor.executeTask(task, this.hubStorage.get(task.hubId)).pipe(
                catchError((error) => {
                    if (error instanceof TimeoutError) {
                        // Skipping task because of timeout is not a critical error and can be safely ignored
                        return of(PortCommandExecutionStatus.executionError);
                    }
                    throw error;
                }),
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
        queueCompressorFactory: TaskQueueCompressorFactoryService,
    ) {
        this.taskComposer = portCommandTaskComposerFactory.create();
        this.taskSuppressor = taskSuppressorFactory.create();
        this.taskExecutor = taskExecutorFactory.create();
        this.queueCompressor = queueCompressorFactory.create();
    }

    private composeTasks(
        bindings: ControlSchemeBinding[],
        bindingValues: number[],
        lastExecutedTasksEntities: Dictionary<PortCommandTask>,
        ioStateEntities: Dictionary<AttachedIoPropsModel>
    ): PortCommandTask[] {
        return bindings.map((binding, index) => {
            const value = bindingValues[index];
            const lastExecutedBindingTask = lastExecutedTasksEntities[lastExecutedTaskIdFn(binding.output)];
            const ioState = ioStateEntities[attachedIosIdFn(binding.output)];
            return this.taskComposer.composeTask(
                binding,
                value,
                ioState,
                lastExecutedBindingTask,
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
                const lastExecutedCommandOfKind = lastExecutedTasks[lastExecutedTaskIdFn(nextTask)];
                if ((lastExecutedCommandOfKind && lastExecutedCommandOfKind.taskType !== nextTask.taskType)
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
