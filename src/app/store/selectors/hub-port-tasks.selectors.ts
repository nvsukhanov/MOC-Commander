/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { IState } from '../i-state';
import { LAST_EXECUTED_TASKS_ENTITY_ADAPTER } from '../entity-adapters';

const HUB_PORT_TASKS_FEATURE_SELECTOR = createFeatureSelector<IState['hubPortTasks']>('hubPortTasks');

const LAST_EXECUTED_TASKS_ENTITY_SELECTORS = LAST_EXECUTED_TASKS_ENTITY_ADAPTER.getSelectors();

const SELECT_ALL = createSelector(
    createSelector(HUB_PORT_TASKS_FEATURE_SELECTOR, (state) => state.lastExecutedTasks),
    LAST_EXECUTED_TASKS_ENTITY_SELECTORS.selectAll,
);

export const HUB_PORT_TASKS_SELECTORS = {
    selectQueue: createSelector(HUB_PORT_TASKS_FEATURE_SELECTOR, (state) => state.queue),
    selectQueueLength: createSelector(HUB_PORT_TASKS_FEATURE_SELECTOR, (state) => state.queue.length),
    lastTaskExecutionTime: createSelector(HUB_PORT_TASKS_FEATURE_SELECTOR, (state) => Math.round(state.lastTaskExecutionTime)),
    selectTotalTasksExecuted: createSelector(HUB_PORT_TASKS_FEATURE_SELECTOR, (state) => state.totalTasksExecuted),
    selectMaxQueueLength: createSelector(HUB_PORT_TASKS_FEATURE_SELECTOR, (state) => state.maxQueueLength),
    selectFirstTask: createSelector(HUB_PORT_TASKS_FEATURE_SELECTOR, (state) => state.queue[0]),
    selectLastExecutedTasksEntities: createSelector(
        createSelector(HUB_PORT_TASKS_FEATURE_SELECTOR, (state) => state.lastExecutedTasks),
        LAST_EXECUTED_TASKS_ENTITY_SELECTORS.selectEntities
    ),
    selectLastExecutedBindingIds: createSelector(
        SELECT_ALL,
        (tasks) => {
            return new Set(tasks.map((task) => task.bindingId));
        }
    ),
};
