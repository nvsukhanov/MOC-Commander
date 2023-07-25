import { createSelector } from '@ngrx/store';

import { CONTROL_SCHEME_ENTITY_ADAPTER, CONTROL_SCHEME_FEATURE } from '../reducers';
import { ControlSchemeModel } from '../models';

const SELECT_ALL = createSelector(
    CONTROL_SCHEME_FEATURE.selectControlSchemesState,
    CONTROL_SCHEME_ENTITY_ADAPTER.getSelectors().selectAll
);

const SELECT_ENTITIES = createSelector(
    CONTROL_SCHEME_FEATURE.selectControlSchemesState,
    CONTROL_SCHEME_ENTITY_ADAPTER.getSelectors().selectEntities
);

const SELECT_IDS = createSelector(
    CONTROL_SCHEME_FEATURE.selectControlSchemesState,
    CONTROL_SCHEME_ENTITY_ADAPTER.getSelectors().selectIds
);

const SELECT_TOTAL = createSelector(
    CONTROL_SCHEME_FEATURE.selectControlSchemesState,
    CONTROL_SCHEME_ENTITY_ADAPTER.getSelectors().selectTotal
);

export const CONTROL_SCHEME_SELECTORS = {
    selectAll: SELECT_ALL,
    selectEntities: SELECT_ENTITIES,
    selectIds: SELECT_IDS,
    selectTotal: SELECT_TOTAL,
    selectScheme: (id: string) => createSelector(
        SELECT_ENTITIES,
        (state) => state[id]
    ),
    selectRunningSchemeId: CONTROL_SCHEME_FEATURE.selectRunningSchemeId,
    selectRunningScheme: createSelector(
        SELECT_ENTITIES,
        CONTROL_SCHEME_FEATURE.selectRunningSchemeId,
        (entities, runningSchemeId): ControlSchemeModel | null => runningSchemeId !== null ? entities[runningSchemeId] ?? null : null
    ),
    selectIsAnySchemeRunning: createSelector(
        CONTROL_SCHEME_FEATURE.selectRunningSchemeId,
        (runningSchemeId) => runningSchemeId !== null
    )
} as const;
