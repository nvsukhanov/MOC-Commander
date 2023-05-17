import { Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { animationFrameScheduler, combineLatest, from, map, mergeMap, NEVER, Observable, of, switchMap, take, throttleTime } from 'rxjs';
import { CONTROL_SCHEME_SELECTORS, HUB_PORT_TASKS_SELECTORS } from '../selectors';
import { Action, Store } from '@ngrx/store';
import { CONTROL_SCHEME_ACTIONS, LAST_EXECUTED_TASKS_ACTIONS } from '../actions';
import {
    IPortCommandTaskComposer,
    ITaskExecutor,
    ITaskSuppressor,
    PortCommandTaskComposerFactoryService,
    TaskExecutorFactoryService,
    TaskSuppressorFactory
} from '../../tasks-processing';
import { lastExecutedTaskIdFn } from '../entity-adapters';
import { PortCommandTask } from '../../common';
import { ControlSchemeBinding } from '../i-state';
import { Dictionary } from '@ngrx/entity';
import { HubStorageService } from '../hub-storage.service';

@Injectable()
export class PortOutputCommandEffects {
    public readonly startComposingTasks$ = createEffect(() => {
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
            map(({ tasks, lastExecutedTasksEntities }) => {
                return this.suppressTasks(tasks, lastExecutedTasksEntities);
            }),
            switchMap((tasks) => tasks ? from(tasks) : NEVER),
            throttleTime(100, animationFrameScheduler, { leading: true, trailing: true }),
            mergeMap((task) => this.taskExecutor.executeTask(task, this.hubStorage.get(task.hubId)).pipe(
                map((status) => [ status, task ]),
                take(1)
            )),
            map(([ , task ]) => LAST_EXECUTED_TASKS_ACTIONS.setLastExecutedTask({ task }))
        ) as Observable<Action>;
    });

    private readonly taskComposer: IPortCommandTaskComposer;

    private readonly taskSuppressor: ITaskSuppressor;

    private readonly taskExecutor: ITaskExecutor;

    constructor(
        private readonly actions$: Actions,
        private readonly store: Store,
        private readonly hubStorage: HubStorageService,
        portCommandTaskComposerFactory: PortCommandTaskComposerFactoryService,
        taskSuppressorFactory: TaskSuppressorFactory,
        taskExecutorFactory: TaskExecutorFactoryService,
    ) {
        this.taskComposer = portCommandTaskComposerFactory.create();
        this.taskSuppressor = taskSuppressorFactory.create();
        this.taskExecutor = taskExecutorFactory.create();
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

    private suppressTasks(
        tasks: PortCommandTask[],
        lastExecutedTasksEntities: Dictionary<PortCommandTask>
    ): PortCommandTask[] {
        return tasks.filter((task) => {
            const previousTask = lastExecutedTasksEntities[lastExecutedTaskIdFn(task.hubId, task.portId)];
            return previousTask ? !this.taskSuppressor.shouldSuppressTask(task, previousTask) : true;
        });
    }
}
