/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { IState } from '../i-state';
import { LAST_EXECUTED_TASKS_ENTITY_ADAPTER } from '../entity-adapters';

const LAST_EXECUTED_TASKS_FEATURE_SELECTOR = createFeatureSelector<IState['lastExecutedTasks']>('lastExecutedTasks');

const LAST_EXECUTED_TASKS_ENTITY_SELECTORS = LAST_EXECUTED_TASKS_ENTITY_ADAPTER.getSelectors();

export const HUB_PORT_TASKS_SELECTORS = {
    selectLastExecutedTasksEntities: createSelector(
        LAST_EXECUTED_TASKS_FEATURE_SELECTOR,
        LAST_EXECUTED_TASKS_ENTITY_SELECTORS.selectEntities
    )
};
