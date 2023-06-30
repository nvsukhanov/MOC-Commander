import { createSelector } from '@ngrx/store';

import { CONTROLLER_SETTINGS_ENTITY_ADAPTER, CONTROLLER_SETTINGS_FEATURE } from './controller-settings.reducer';

const CONTROLLER_SETTINGS_ENTITY_SELECTORS = CONTROLLER_SETTINGS_ENTITY_ADAPTER.getSelectors();

export const CONTROLLER_SETTINGS_SELECTORS = {
    selectEntities: createSelector(
        CONTROLLER_SETTINGS_FEATURE.selectControllerSettingsState,
        CONTROLLER_SETTINGS_ENTITY_SELECTORS.selectEntities
    ),
    selectByControllerId: (controllerId: string) => createSelector(
        CONTROLLER_SETTINGS_SELECTORS.selectEntities,
        (controllerSettingsEntities) => controllerSettingsEntities[controllerId]
    ),
} as const;
