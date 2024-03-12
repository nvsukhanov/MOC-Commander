import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { EMPTY, Observable, combineLatest, filter, from, map, mergeMap, of, pairwise, startWith, switchMap, take, takeUntil } from 'rxjs';
import { Action, Store } from '@ngrx/store';
import { inject } from '@angular/core';
import { ControlSchemeBindingType } from '@app/shared-misc';

import { attachedIosIdFn } from '../../reducers';
import { CONTROL_SCHEME_ACTIONS, PORT_TASKS_ACTIONS } from '../../actions';
import { CONTROLLER_INPUT_SELECTORS, CONTROL_SCHEME_SELECTORS, PORT_TASKS_SELECTORS } from '../../selectors';
import {
    AttachedIoPropsModel,
    ControlSchemeBinding,
    ControlSchemeBindingInputs,
    ControlSchemeModel,
    ControllerInputModel,
    PortCommandTask
} from '../../models';
import { ITaskFilter, TASK_FILTER } from './i-task-filter';
import { ITaskFactory, TASK_FACTORY } from './i-task-factory';
import { ITasksInputExtractor, TASKS_INPUT_EXTRACTOR } from './i-task-input-extractor';

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

type BindingWithInputData<T extends ControlSchemeBindingType = ControlSchemeBindingType> = {
    binding: ControlSchemeBinding & { bindingType: T };
    prevInput: { [k in keyof ControlSchemeBindingInputs<T>]: ControllerInputModel | null };
    nextInput: { [k in keyof ControlSchemeBindingInputs<T>]: ControllerInputModel | null };
};

type TaskComposingData = {
    hubId: string;
    portId: number;
    bindingInputs: Array<BindingWithInputData>;
    lastExecutedTask: PortCommandTask | null;
    runningTask: PortCommandTask | null;
    pendingTask: PortCommandTask | null;
    ioProps: Omit<AttachedIoPropsModel, 'hubId' | 'portId'> | null;
};

function getTaskComposingData$(
    store: Store,
    actions: Actions,
    samePortBindings: ControlSchemeBinding[],
    inputComposer: ITasksInputExtractor
): Observable<TaskComposingData> {
    if (!samePortBindings.length) {
        return EMPTY;
    }

    const inputStream = store.select(CONTROLLER_INPUT_SELECTORS.selectEntities);

    const hubId = samePortBindings[0].hubId;
    const portId = samePortBindings[0].portId;

    const bindingWithInputsStreams: Array<Observable<BindingWithInputData>> = samePortBindings.map((binding) => {
        return inputComposer.extractInputs(binding, inputStream).pipe(
            take(1),
            switchMap((initialValue) => inputComposer.extractInputs(binding, inputStream).pipe(
                startWith(initialValue),
                pairwise(),
                map(([ prevInput, nextInput ]) => ({ binding, prevInput, nextInput }))
            ))
        );
    });

    return combineLatest(bindingWithInputsStreams).pipe(
        concatLatestFrom(() => store.select(PORT_TASKS_SELECTORS.selectTaskExecutionData({ hubId, portId }))),
        map(([ bindingInputs, taskExecutionData ]) => ({
            ...taskExecutionData,
            bindingInputs,
            hubId,
            portId
        })),
        takeUntil(actions.pipe(ofType(CONTROL_SCHEME_ACTIONS.stopScheme)))
    );
}

function composeTasksForBindingGroup(
    composingData: TaskComposingData,
    taskBuilder: ITaskFactory
): PortCommandTask[] {
    const previousTask: PortCommandTask | null = composingData.runningTask
        || composingData.lastExecutedTask
        || composingData.pendingTask
        || null;

    return composingData.bindingInputs
                        .map(({
                            binding,
                            prevInput,
                            nextInput
                        }) => taskBuilder.buildTask(binding, nextInput, prevInput, composingData.ioProps, previousTask))
                        .filter((task): task is PortCommandTask => !!task)
                        .sort((a, b) => a.inputTimestamp - b.inputTimestamp);
}

export const COMPOSE_TASKS_EFFECT = createEffect((
    actions: Actions = inject(Actions),
    store: Store = inject(Store),
    taskFilter: ITaskFilter = inject(TASK_FILTER),
    taskBuilder: ITaskFactory = inject(TASK_FACTORY),
    inputComposer: ITasksInputExtractor = inject(TASKS_INPUT_EXTRACTOR)
) => {
    return actions.pipe(
        ofType(CONTROL_SCHEME_ACTIONS.schemeStarted, CONTROL_SCHEME_ACTIONS.stopScheme),
        switchMap((action) => action.type === CONTROL_SCHEME_ACTIONS.schemeStarted.type
                              ? store.select(CONTROL_SCHEME_SELECTORS.selectRunningScheme)
                              : of(null)
        ),
        filter((scheme): scheme is ControlSchemeModel => !!scheme),
        switchMap((scheme) => from(groupBindingsByHubsPortId(scheme.bindings))),
        mergeMap((groupedBindings) => getTaskComposingData$(store, actions, groupedBindings, inputComposer)),
        map((composingData) => ({
            ...composingData,
            tasks: composeTasksForBindingGroup(composingData, taskBuilder)
        })),
        filter(({ tasks }) => tasks.length > 0),
        map(({ pendingTask, tasks, lastExecutedTask, runningTask, portId, hubId }) => {
            const currentTask = runningTask || lastExecutedTask || null;
            const nextPendingTask = taskFilter.calculateNextPendingTask(
                currentTask,
                pendingTask,
                tasks
            );
            const shouldUpdateQueue = nextPendingTask !== pendingTask;
            const isNextTaskMoreRecent = (nextPendingTask?.inputTimestamp ?? -Infinity) > (currentTask?.inputTimestamp ?? -Infinity);
            return {
                hubId,
                portId,
                pendingTask: nextPendingTask,
                shouldUpdateQueue: shouldUpdateQueue && isNextTaskMoreRecent
            };
        }),
        filter(({ shouldUpdateQueue }) => shouldUpdateQueue),
        map(({ hubId, portId, pendingTask }: { hubId: string; portId: number; pendingTask: PortCommandTask | null }) =>
            PORT_TASKS_ACTIONS.updateQueue({ hubId, portId, pendingTask })
        )
    ) as Observable<Action>;
}, { functional: true });
