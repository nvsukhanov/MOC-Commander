/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { IState } from '../i-state';
import { CONTROL_SCHEME_BINDING_ADAPTER } from '../entity-adapters';

const CONTROL_BINDING_SCHEME_FEATURE_SELECTOR = createFeatureSelector<IState['controlSchemeBindings']>('controlSchemeBindings');

const CONTROL_BINDING_SCHEME_ENTITY_SELECTORS = CONTROL_SCHEME_BINDING_ADAPTER.getSelectors();

const CONTROL_BINDING_SCHEME_SELECT_ALL = createSelector(
    CONTROL_BINDING_SCHEME_FEATURE_SELECTOR,
    CONTROL_BINDING_SCHEME_ENTITY_SELECTORS.selectAll
);

export const CONTROL_BINDING_SCHEME_SELECTORS = {
    selectAll: CONTROL_BINDING_SCHEME_SELECT_ALL,
    selectBySchemeId: (id: string) => createSelector(CONTROL_BINDING_SCHEME_SELECT_ALL, (state) => state.filter((binding) => binding.schemeId === id))
};
