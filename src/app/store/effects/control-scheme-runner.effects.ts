import { Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import {
    NEVER,
    Observable,
    TimeoutError,
    animationFrames,
    catchError,
    combineLatest,
    concat,
    exhaustMap,
    filter,
    last,
    map,
    of,
    switchMap,
    take,
    timeout
} from 'rxjs';
import { Store } from '@ngrx/store';
import { Dictionary } from '@ngrx/entity';
import { PortCommandExecutionStatus } from '@nvsukhanov/rxpoweredup';

import { PortCommandTask } from '@app/shared';
import { CONTROL_SCHEME_RUNNING_STATE_SELECTORS, CONTROL_SCHEME_SELECTORS, HUB_ATTACHED_IO_STATE_SELECTORS, HUB_PORT_TASKS_SELECTORS } from '../selectors';
import { CONTROL_SCHEME_ACTIONS, HUBS_ACTIONS, HUB_ATTACHED_IOS_ACTIONS, HUB_PORT_TASKS_ACTIONS } from '../actions';
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
import { hubAttachedIosIdFn, lastExecutedTaskIdFn } from '../entity-adapters';
import { AttachedIOState, ControlSchemeBinding } from '../i-state';
import { HubStorageService } from '../hub-storage.service';

@Injectable()
export class ControlSchemeRunnerEffects {
    public startSchemeRunning$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(CONTROL_SCHEME_ACTIONS.startScheme),
            switchMap((action) => concat(
                this.deleteAllVirtualPortsAtSchemeRelatedHubs(action.schemeId),
                this.createVirtualPortAtSchemeRelatedHubs(action.schemeId)
            ).pipe(
                this.schemePreparationTimeout$,
                last(),
                map(() => CONTROL_SCHEME_ACTIONS.schemeStarted({ schemeId: action.schemeId })),
                catchError((e) => {
                    console.error(e);
                    return of(CONTROL_SCHEME_ACTIONS.schemeStartError({ schemeId: action.schemeId }));
                })
            ))
        );
    });

    public stopSchemeRunning$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(CONTROL_SCHEME_ACTIONS.stopScheme),
            concatLatestFrom(() => this.store.select(CONTROL_SCHEME_RUNNING_STATE_SELECTORS.selectRunningSchemeId)),
            switchMap(([ , schemeId ]) => {
                if (schemeId === null) {
                    return of(CONTROL_SCHEME_ACTIONS.schemeStopped());
                }
                return this.deleteAllVirtualPortsAtSchemeRelatedHubs(schemeId).pipe(
                    map(() => CONTROL_SCHEME_ACTIONS.schemeStopped()),
                    catchError((e) => {
                        console.error(e);
                        return of(CONTROL_SCHEME_ACTIONS.schemeStopError());
                    })
                );
            })
        );
    });

    public readonly stopSchemeOnHubDisconnect$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(HUBS_ACTIONS.disconnected),
            concatLatestFrom(() => this.store.select(CONTROL_SCHEME_RUNNING_STATE_SELECTORS.selectRunningSchemeId)),
            filter(([ , schemeId ]) => schemeId !== null),
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            concatLatestFrom(([ , schemeId ]) => this.store.select(CONTROL_SCHEME_SELECTORS.selectScheme(schemeId!))),
            filter(([ [ action ], scheme ]) => !!scheme
                && (
                    scheme.bindings.some((binding) => binding.output.hubId === action.hubId)
                    || scheme.virtualPorts.some((virtualPort) => virtualPort.hubId === action.hubId)
                )
            ),
            map(() => CONTROL_SCHEME_ACTIONS.stopScheme())
        );
    });

    public readonly composeTasks$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(
                CONTROL_SCHEME_ACTIONS.schemeStarted,
                CONTROL_SCHEME_ACTIONS.schemeStopped,
            ),
            switchMap((action) => action.type === CONTROL_SCHEME_ACTIONS.schemeStarted.type
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
                CONTROL_SCHEME_ACTIONS.schemeStarted,
                CONTROL_SCHEME_ACTIONS.schemeStopped,
            ),
            switchMap((a) => a.type === CONTROL_SCHEME_ACTIONS.schemeStarted.type
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

    private readonly schemePreparationTimeout$ = timeout(2000); // TODO: why 2000? move to config.

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
        ioStateEntities: Dictionary<AttachedIOState>
    ): PortCommandTask[] {
        return bindings.map((binding, index) => {
            const value = bindingValues[index];
            const lastExecutedBindingTask = lastExecutedTasksEntities[lastExecutedTaskIdFn(binding.output)];
            const ioState = ioStateEntities[hubAttachedIosIdFn(binding.output)];
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

    private deleteAllVirtualPortsAtSchemeRelatedHubs(
        schemeId: string
    ): Observable<void> {
        return this.store.select(CONTROL_SCHEME_SELECTORS.selectVirtualPortsOfSchemeRelatedHubs(schemeId)).pipe(
            take(1),
            switchMap((virtualPorts) => {
                if (virtualPorts.length) {
                    return concat(...virtualPorts.map((virtualPort) => this.hubStorage.get(virtualPort.hubId).ports.deleteVirtualPort(virtualPort.portId)));
                }
                return of(void 0);
            }),
            last(),
            map(() => void 0)
        );
    }

    private createVirtualPortAtSchemeRelatedHubs(
        schemeId: string
    ): Observable<unknown> {
        return this.store.select(CONTROL_SCHEME_SELECTORS.selectScheme(schemeId)).pipe(
            filter((scheme) => !!scheme),
            take(1),
            switchMap((scheme) => {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                scheme!.virtualPorts.forEach((port) => {
                    this.store.dispatch(HUB_ATTACHED_IOS_ACTIONS.createVirtualPort({ hubId: port.hubId, portIdA: port.portIdA, portIdB: port.portIdB }));
                });
                return this.store.select(CONTROL_SCHEME_SELECTORS.areAllNecessaryVirtualPortsCreated(schemeId)).pipe(
                    filter((areAllNecessaryVirtualPortsCreated) => areAllNecessaryVirtualPortsCreated),
                    take(1)
                );
            })
        );
    }
}
