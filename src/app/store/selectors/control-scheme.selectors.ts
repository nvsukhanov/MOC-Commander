import { createSelector } from '@ngrx/store';

import { CONTROL_SCHEMES_ENTITY_ADAPTER, CONTROL_SCHEMES_FEATURE } from '../reducers';

const CONTROL_SCHEME_ENTITY_SELECTORS = CONTROL_SCHEMES_ENTITY_ADAPTER.getSelectors();

const CONTROL_SCHEME_SELECT_ENTITIES = createSelector(
    CONTROL_SCHEMES_FEATURE.selectControlSchemesState,
    CONTROL_SCHEME_ENTITY_SELECTORS.selectEntities
);

const CONTROL_SCHEME_SELECT_ALL = createSelector(
    CONTROL_SCHEMES_FEATURE.selectControlSchemesState,
    CONTROL_SCHEME_ENTITY_SELECTORS.selectAll
);

const CONTROL_SCHEME_SELECT_IDS = createSelector(
    CONTROL_SCHEMES_FEATURE.selectControlSchemesState,
    CONTROL_SCHEME_ENTITY_SELECTORS.selectIds
);

export const CONTROL_SCHEME_SELECTORS = {
    selectAll: CONTROL_SCHEME_SELECT_ALL,
    selectIds: CONTROL_SCHEME_SELECT_IDS,
    selectEntities: CONTROL_SCHEME_SELECT_ENTITIES,
    selectTotal: createSelector(
        CONTROL_SCHEMES_FEATURE.selectControlSchemesState,
        CONTROL_SCHEME_ENTITY_SELECTORS.selectTotal
    ),
    selectScheme: (id: string) => createSelector(
        CONTROL_SCHEME_SELECTORS.selectEntities,
        (state) => state[id]
    ),
    selectRunningSchemeId: CONTROL_SCHEMES_FEATURE.selectRunningSchemeId,
    selectIsAnySchemeRunning: createSelector(
        CONTROL_SCHEMES_FEATURE.selectRunningSchemeId,
        (runningSchemeId) => runningSchemeId !== null
    )
} as const;
