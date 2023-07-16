import { createSelector } from '@ngrx/store';
import { CONTROLLER_SELECTORS, CONTROLLER_SETTINGS_SELECTORS } from '@app/store';

export const CONTROLLERS_LIST_SELECTORS = {
    viewModel: createSelector(
        CONTROLLER_SELECTORS.selectAll,
        CONTROLLER_SETTINGS_SELECTORS.selectEntities,
        (controllers, controllerSettingsEntities) => controllers.map((controller) => ({
            controller,
            settings: controllerSettingsEntities[controller.id]
        }))
    ),
} as const;
