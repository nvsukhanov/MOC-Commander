import { Injectable } from '@angular/core';
import { HUB_PORT_TASKS_ACTIONS } from '../actions/hub-port-tasks.actions';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { CONTROL_SCHEME_RUNNER_ACTIONS } from '../actions';
import { combineLatest, EMPTY, filter, map, of, switchMap } from 'rxjs';
import { IPortCommandTaskComposer, PortCommandTask, PortCommandTaskComposerFactoryService } from '../../control-scheme';
import { CONTROL_SCHEME_SELECTORS } from '../selectors';
import { Store } from '@ngrx/store';

@Injectable()
export class HubPortTasksEffects {
    public readonly clearTasksQueueOnSchemeRunningStop$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(CONTROL_SCHEME_RUNNER_ACTIONS.stopRunning),
            map(() => HUB_PORT_TASKS_ACTIONS.clearQueue()),
        );
    });

    public readonly startComposingTasks$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(CONTROL_SCHEME_RUNNER_ACTIONS.runScheme),
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
            filter((tasks) => tasks.length > 0),
            map((tasks) => HUB_PORT_TASKS_ACTIONS.add({ tasks })),
        );
    });

    private readonly taskComposer: IPortCommandTaskComposer;

    constructor(
        private readonly actions$: Actions,
        private readonly store: Store,
        portCommandTaskComposerFactory: PortCommandTaskComposerFactoryService,
    ) {
        this.taskComposer = portCommandTaskComposerFactory.create();
    }
}
