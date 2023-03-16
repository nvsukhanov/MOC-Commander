import { createFeatureSelector, createSelector } from '@ngrx/store';
import { IState } from '../i-state';

export const SELECT_HUB_FEATURE = createFeatureSelector<IState['hub']>('hub');

export const SELECT_HUB_CONNECTION_STATE = createSelector(
    SELECT_HUB_FEATURE,
    (state) => state.connectionState
);
