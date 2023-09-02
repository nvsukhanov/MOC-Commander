import { createSelector } from '@ngrx/store';
import { CONTROLLER_CONNECTION_SELECTORS, CONTROLLER_SELECTORS, CONTROLLER_SETTINGS_SELECTORS } from '@app/store';

export const CONTROLLERS_LIST_SELECTORS = {
    viewModel: createSelector(
        CONTROLLER_SELECTORS.selectAll,
        CONTROLLER_SETTINGS_SELECTORS.selectEntities,
        CONTROLLER_CONNECTION_SELECTORS.selectEntities,
        (controllers, settingsEntities, connectionStateEntities) => controllers.map((controller) => ({
            controller,
            isConnected: !!connectionStateEntities[controller.id],
            settings: settingsEntities[controller.id]
        }))
    ),
} as const;
