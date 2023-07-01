import { createFeature, createReducer, on } from '@ngrx/store';
import { EntityAdapter, EntityState, createEntityAdapter } from '@ngrx/entity';

import { CONTROL_SCHEME_ACTIONS, HUB_PORT_TASKS_ACTIONS } from '../actions';
import { PortCommandTask } from '@app/shared';

export type HubPortTasksState = {
    queue: PortCommandTask[],
    totalTasksExecuted: number,
    lastTaskExecutionTime: number,
    maxQueueLength: number,
    lastExecutedTasks: EntityState<PortCommandTask>
};

export const LAST_EXECUTED_TASKS_ENTITY_ADAPTER: EntityAdapter<PortCommandTask> = createEntityAdapter<PortCommandTask>({
    selectId: (task) => lastExecutedTaskIdFn(task),
});

export function lastExecutedTaskIdFn(
    { hubId, portId }: { hubId: string, portId: number }
): string {
    return `${hubId}/${portId}`;
}

export const HUB_PORT_TASKS_INITIAL_STATE: HubPortTasksState = {
    queue: [],
    totalTasksExecuted: 0,
    lastTaskExecutionTime: 0,
    maxQueueLength: 0,
    lastExecutedTasks: LAST_EXECUTED_TASKS_ENTITY_ADAPTER.getInitialState()
};

export const HUB_PORT_TASKS_FEATURE = createFeature({
    name: 'hubPortTasks',
    reducer: createReducer(
        HUB_PORT_TASKS_INITIAL_STATE,
        on(HUB_PORT_TASKS_ACTIONS.setQueue, (state, { tasks }): HubPortTasksState => {
            return {
                ...state,
                queue: tasks
            };
        }),
        on(HUB_PORT_TASKS_ACTIONS.markTaskAsExecuted, (state, { task }): HubPortTasksState => {
            const taskExecutionDuration = Date.now() - task.createdAt;
            return {
                ...state,
                queue: state.queue.filter((t) => t !== task),
                totalTasksExecuted: state.totalTasksExecuted + 1,
                lastTaskExecutionTime: taskExecutionDuration,
                maxQueueLength: Math.max(state.maxQueueLength, state.queue.length),
                lastExecutedTasks: LAST_EXECUTED_TASKS_ENTITY_ADAPTER.upsertOne(task, state.lastExecutedTasks)
            };
        }),
        on(CONTROL_SCHEME_ACTIONS.startScheme, (): HubPortTasksState => {
            return {
                queue: [],
                totalTasksExecuted: 0,
                lastTaskExecutionTime: 0,
                maxQueueLength: 0,
                lastExecutedTasks: LAST_EXECUTED_TASKS_ENTITY_ADAPTER.getInitialState()
            };
        }),
        on(CONTROL_SCHEME_ACTIONS.stopScheme, (state): HubPortTasksState => {
            return {
                ...state,
                queue: [],
                lastExecutedTasks: LAST_EXECUTED_TASKS_ENTITY_ADAPTER.getInitialState()
            };
        })
    )
});
