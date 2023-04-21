import { createFeatureSelector, createSelector } from '@ngrx/store';
import { IState } from '../i-state';

const HUB_PORT_TASKS_FEATURE_SELECTOR = createFeatureSelector<IState['hubPortTasks']>('hubPortTasks');

export const HUB_PORT_TASKS_SELECTORS = {
    selectQueue: createSelector(HUB_PORT_TASKS_FEATURE_SELECTOR, (state) => state.queue),
};
