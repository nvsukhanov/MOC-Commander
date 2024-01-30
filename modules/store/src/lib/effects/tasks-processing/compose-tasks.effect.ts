import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Observable, filter, from, map, mergeMap, of, startWith, switchMap, takeUntil } from 'rxjs';
import { Action, Store } from '@ngrx/store';
import { inject } from '@angular/core';

import { attachedIosIdFn } from '../../reducers';
import { CONTROLLER_INPUT_ACTIONS, CONTROL_SCHEME_ACTIONS, PORT_TASKS_ACTIONS } from '../../actions';
import { BindingTaskComposingData, CONTROL_SCHEME_SELECTORS, PORT_TASKS_SELECTORS } from '../../selectors';
import { ControlSchemeBinding, ControlSchemeModel, PortCommandTask } from '../../models';
import { ITaskFilter, TASK_FILTER } from './i-task-filter';
import { ITaskFactory, TASK_FACTORY } from './i-task-factory';

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
        startWith(null),
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
    taskBuilder: ITaskFactory
): PortCommandTask[] {
    const previousTask: PortCommandTask | null = composingData.runningTask
        || composingData.lastExecutedTask
        || composingData.pendingTask
        || null;

    return composingData.bindings.map((binding) => taskBuilder.buildTask(binding, composingData.inputState, composingData.ioProps, previousTask))
                        .filter((task): task is PortCommandTask => !!task)
                        .sort((a, b) => a.inputTimestamp - b.inputTimestamp);
}

export const COMPOSE_TASKS_EFFECT = createEffect((
    actions: Actions = inject(Actions),
    store: Store = inject(Store),
    taskFilter: ITaskFilter = inject(TASK_FILTER),
    taskBuilder: ITaskFactory = inject(TASK_FACTORY)
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
        map((composingData) => {
            return {
                ...composingData,
                tasks: composeTasksForBindingGroup(composingData, taskBuilder)
            };
        }),
        filter(({ tasks }) => tasks.length > 0),
        map(({ pendingTask, tasks, lastExecutedTask, runningTask, portId, hubId }) => {
            const currentTask = runningTask || lastExecutedTask || null;
            const nextPendingTask = taskFilter.calculateNextPendingTask(
                currentTask,
                pendingTask,
                tasks
            );
            const shouldUpdateQueue = nextPendingTask !== pendingTask;
            return {
                hubId,
                portId,
                pendingTask: nextPendingTask,
                shouldUpdateQueue
            };
        }),
        filter(({ shouldUpdateQueue }) => shouldUpdateQueue),
        map(({ hubId, portId, pendingTask }: { hubId: string; portId: number; pendingTask: PortCommandTask | null }) =>
            PORT_TASKS_ACTIONS.updateQueue({ hubId, portId, pendingTask })
        )
    ) as Observable<Action>;
}, { functional: true });
