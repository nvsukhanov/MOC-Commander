/* eslint-disable @ngrx/on-function-explicit-return-type */
import { createReducer, on } from '@ngrx/store';
import { INITIAL_STATE } from '../initial-state';
import { CONTROL_SCHEME_ACTIONS, LAST_EXECUTED_TASKS_ACTIONS } from '../actions';
import { LAST_EXECUTED_TASKS_ENTITY_ADAPTER } from '../entity-adapters';

export const LAST_EXECUTED_TASKS_REDUCER = createReducer(
    INITIAL_STATE['lastExecutedTasks'],
    on(LAST_EXECUTED_TASKS_ACTIONS.setLastExecutedTask, (state, { task }) => {
        return LAST_EXECUTED_TASKS_ENTITY_ADAPTER.upsertOne(task, state);
    }),
    on(CONTROL_SCHEME_ACTIONS.stopRunning, (state) => {
        return LAST_EXECUTED_TASKS_ENTITY_ADAPTER.removeAll(state);
    }),
);
