import { createSelector } from '@ngrx/store';
import { CONTROLLER_CONNECTION_SELECTORS, CONTROLLER_SELECTORS, CONTROLLER_SETTINGS_SELECTORS, ControllerModel } from '@app/store';

export const WAIT_FOR_CONTROLLER_INPUT_DIALOG_SELECTORS = {
    selectConnectedControllers: createSelector(
        CONTROLLER_CONNECTION_SELECTORS.selectIds,
        CONTROLLER_SELECTORS.selectEntities,
        CONTROLLER_SETTINGS_SELECTORS.selectEntities,
        (ids, controllers, settings) => {
            return ids.map((id) => controllers[id])
                      .filter((c): c is ControllerModel => !!c)
                      .filter((c) => !settings[c.id] || !(settings[c.id]?.ignoreInput));
        }
    )
};
