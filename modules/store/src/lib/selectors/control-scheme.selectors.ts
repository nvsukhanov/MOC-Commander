import { createSelector } from '@ngrx/store';

import { CONTROL_SCHEME_ENTITY_ADAPTER, CONTROL_SCHEME_FEATURE, ControlSchemeRunState } from '../reducers';
import { ControlSchemeModel } from '../models';

const SELECT_ALL = createSelector(
  CONTROL_SCHEME_FEATURE.selectControlSchemesState,
  CONTROL_SCHEME_ENTITY_ADAPTER.getSelectors().selectAll,
);

const SELECT_ENTITIES = createSelector(
  CONTROL_SCHEME_FEATURE.selectControlSchemesState,
  CONTROL_SCHEME_ENTITY_ADAPTER.getSelectors().selectEntities,
);

const SELECT_IDS = createSelector(
  CONTROL_SCHEME_FEATURE.selectControlSchemesState,
  CONTROL_SCHEME_ENTITY_ADAPTER.getSelectors().selectIds,
);

const SELECT_TOTAL = createSelector(
  CONTROL_SCHEME_FEATURE.selectControlSchemesState,
  CONTROL_SCHEME_ENTITY_ADAPTER.getSelectors().selectTotal,
);

export const CONTROL_SCHEME_SELECTORS = {
  selectAll: SELECT_ALL,
  selectEntities: SELECT_ENTITIES,
  selectIds: SELECT_IDS,
  selectTotal: SELECT_TOTAL,
  selectScheme: (name: string) => createSelector(SELECT_ENTITIES, (state) => state[name]),
  selectRunningState: CONTROL_SCHEME_FEATURE.selectRunningState,
  selectRunningSchemeName: CONTROL_SCHEME_FEATURE.selectRunningSchemeName,
  selectRunningScheme: createSelector(
    SELECT_ENTITIES,
    CONTROL_SCHEME_FEATURE.selectRunningSchemeName,
    (entities, runningSchemeName): ControlSchemeModel | null =>
      runningSchemeName !== null ? (entities[runningSchemeName] ?? null) : null,
  ),
  selectIsAnySchemeRunning: createSelector(
    CONTROL_SCHEME_FEATURE.selectRunningState,
    (runningState) => runningState !== ControlSchemeRunState.Idle,
  ),
  selectNextSchemeName: (name: string) =>
    createSelector(SELECT_IDS, (ids) => {
      let postfix = '';
      let postfixValue = 0;
      while (ids.some((id) => id === name + postfix)) {
        postfixValue++;
        postfix = ` (${postfixValue})`;
      }
      return name + postfix;
    }),
} as const;
