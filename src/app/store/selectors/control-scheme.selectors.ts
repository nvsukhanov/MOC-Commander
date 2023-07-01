import { createSelector } from '@ngrx/store';

import { CONTROL_SCHEMES_ENTITY_ADAPTER, CONTROL_SCHEMES_FEATURE, controllerInputIdFn } from '../reducers';
import { ControlSchemeBinding } from '../models';
import { CONTROLLER_INPUT_SELECTORS } from './controller-input.selectors';

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
    selectScheme: (id: string) => createSelector(
        CONTROL_SCHEME_SELECTORS.selectEntities,
        (state) => state[id]
    ),
    selectRunningSchemeId: CONTROL_SCHEMES_FEATURE.selectRunningSchemeId,
    selectIsAnySchemeRunning: createSelector(
        CONTROL_SCHEMES_FEATURE.selectRunningSchemeId,
        (runningSchemeId) => runningSchemeId !== null
    ),
    selectSchemeBindingInputValue: (
        schemeId: string,
        binding: ControlSchemeBinding
    ) => createSelector(
        CONTROL_SCHEME_SELECTORS.selectScheme(schemeId),
        CONTROLLER_INPUT_SELECTORS.selectEntities,
        (scheme, inputEntities) => {
            if (!scheme || !inputEntities) {
                return 0;
            }
            const input = inputEntities[controllerInputIdFn(binding.input)];
            return input ? input.value : 0;
        }
    ),
    isListening: CONTROL_SCHEMES_FEATURE.selectIsListening,
} as const;
