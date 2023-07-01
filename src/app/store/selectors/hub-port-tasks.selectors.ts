/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { createSelector } from '@ngrx/store';

import { HUB_PORT_TASKS_FEATURE, LAST_EXECUTED_TASKS_ENTITY_ADAPTER } from '../reducers';

const LAST_EXECUTED_TASKS_ENTITY_SELECTORS = LAST_EXECUTED_TASKS_ENTITY_ADAPTER.getSelectors();

const SELECT_ALL = createSelector(
    HUB_PORT_TASKS_FEATURE.selectLastExecutedTasks,
    LAST_EXECUTED_TASKS_ENTITY_SELECTORS.selectAll,
);

export const HUB_PORT_TASKS_SELECTORS = {
    selectQueue: HUB_PORT_TASKS_FEATURE.selectQueue,
    selectQueueLength: createSelector(HUB_PORT_TASKS_FEATURE.selectQueue, (queue) => queue.length),
    lastTaskExecutionTime: HUB_PORT_TASKS_FEATURE.selectLastTaskExecutionTime,
    selectTotalTasksExecuted: HUB_PORT_TASKS_FEATURE.selectTotalTasksExecuted,
    selectMaxQueueLength: HUB_PORT_TASKS_FEATURE.selectMaxQueueLength,
    selectFirstTask: createSelector(HUB_PORT_TASKS_FEATURE.selectQueue, (queue) => queue[0]),
    selectLastExecutedTasksEntities: createSelector(
        HUB_PORT_TASKS_FEATURE.selectLastExecutedTasks,
        LAST_EXECUTED_TASKS_ENTITY_SELECTORS.selectEntities
    ),
    selectLastExecutedBindingIds: createSelector(
        SELECT_ALL,
        (tasks) => {
            return new Set(tasks.map((task) => task.bindingId));
        }
    ),
};
