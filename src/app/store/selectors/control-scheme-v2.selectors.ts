import { createSelector } from '@ngrx/store';

import { CONTROL_SCHEME_V2_ENTITY_ADAPTER, CONTROL_SCHEME_V2_FEATURE } from '../reducers';

const SELECT_ALL = createSelector(
    CONTROL_SCHEME_V2_FEATURE.selectControlSchemeV2State,
    CONTROL_SCHEME_V2_ENTITY_ADAPTER.getSelectors().selectAll
);

const SELECT_ENTITIES = createSelector(
    CONTROL_SCHEME_V2_FEATURE.selectControlSchemeV2State,
    CONTROL_SCHEME_V2_ENTITY_ADAPTER.getSelectors().selectEntities
);

const SELECT_IDS = createSelector(
    CONTROL_SCHEME_V2_FEATURE.selectControlSchemeV2State,
    CONTROL_SCHEME_V2_ENTITY_ADAPTER.getSelectors().selectIds
);

const SELECT_TOTAL = createSelector(
    CONTROL_SCHEME_V2_FEATURE.selectControlSchemeV2State,
    CONTROL_SCHEME_V2_ENTITY_ADAPTER.getSelectors().selectTotal
);

export const CONTROL_SCHEME_V2_SELECTORS = {
    selectAll: SELECT_ALL,
    selectEntities: SELECT_ENTITIES,
    selectIds: SELECT_IDS,
    selectTotal: SELECT_TOTAL,
    selectScheme: (id: string) => createSelector(
        SELECT_ENTITIES,
        (state) => state[id]
    ),
    selectRunningSchemeId: CONTROL_SCHEME_V2_FEATURE.selectRunningSchemeId,
    selectIsAnySchemeRunning: createSelector(
        CONTROL_SCHEME_V2_FEATURE.selectRunningSchemeId,
        (runningSchemeId) => runningSchemeId !== null
    )
} as const;
