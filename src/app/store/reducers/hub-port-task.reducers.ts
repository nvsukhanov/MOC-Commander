/* eslint-disable @ngrx/on-function-explicit-return-type */
import { createReducer, on } from '@ngrx/store';
import { INITIAL_STATE } from '../initial-state';
import { HUB_PORT_TASKS_ACTIONS } from '../actions/hub-port-tasks.actions';

export const HUB_PORT_TASK_REDUCERS = createReducer(
    INITIAL_STATE['hubPortTasks'],
    on(HUB_PORT_TASKS_ACTIONS.add, (state, { tasks }) => {
        return {
            ...state,
            queue: [ ...state.queue, ...tasks ]
        };
    }),
    on(HUB_PORT_TASKS_ACTIONS.executeTask, (state, { task }) => {
        return {
            ...state,
            queue: state.queue.filter((t) => t !== task)
        };
    }),
    on(HUB_PORT_TASKS_ACTIONS.clearQueue, (state) => {
        return {
            ...state,
            queue: []
        };
    })
);
