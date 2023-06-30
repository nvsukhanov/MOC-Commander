import { createReducer, on } from '@ngrx/store';

import { INITIAL_STATE } from '../initial-state';
import { HUB_PORT_TASKS_ACTIONS } from '../actions';
import { LAST_EXECUTED_TASKS_ENTITY_ADAPTER } from '../entity-adapters';
import { IState } from '../i-state';
import { CONTROL_SCHEME_ACTIONS } from '../control-schemes';

export const HUB_PORT_TASKS_REDUCER = createReducer(
    INITIAL_STATE['hubPortTasks'],
    on(HUB_PORT_TASKS_ACTIONS.setQueue, (state, { tasks }): IState['hubPortTasks'] => {
        return {
            ...state,
            queue: tasks
        };
    }),
    on(HUB_PORT_TASKS_ACTIONS.markTaskAsExecuted, (state, { task }): IState['hubPortTasks'] => {
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
    on(CONTROL_SCHEME_ACTIONS.startScheme, (): IState['hubPortTasks'] => {
        return {
            queue: [],
            totalTasksExecuted: 0,
            lastTaskExecutionTime: 0,
            maxQueueLength: 0,
            lastExecutedTasks: LAST_EXECUTED_TASKS_ENTITY_ADAPTER.getInitialState()
        };
    }),
    on(CONTROL_SCHEME_ACTIONS.stopScheme, (state): IState['hubPortTasks'] => {
        return {
            ...state,
            queue: [],
            lastExecutedTasks: LAST_EXECUTED_TASKS_ENTITY_ADAPTER.getInitialState()
        };
    })
);
