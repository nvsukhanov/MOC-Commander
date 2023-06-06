import { createFeatureSelector, createSelector } from '@ngrx/store';

import { IState } from '../i-state';
import { CONTROLLER_SETTINGS_ENTITY_ADAPTER } from '../entity-adapters';

const CONTROLLER_SETTINGS_FEATURE_SELECTOR = createFeatureSelector<IState['controllerSettings']>('controllerSettings');

const CONTROLLER_SETTINGS_ENTITY_SELECTORS = CONTROLLER_SETTINGS_ENTITY_ADAPTER.getSelectors();

export const CONTROLLER_SETTINGS_SELECTORS = {
    selectEntities: createSelector(
        CONTROLLER_SETTINGS_FEATURE_SELECTOR,
        CONTROLLER_SETTINGS_ENTITY_SELECTORS.selectEntities
    ),
    selectByControllerId: (controllerId: string) => createSelector(
        CONTROLLER_SETTINGS_SELECTORS.selectEntities,
        (controllerSettingsEntities) => controllerSettingsEntities[controllerId]
    ),
} as const;
