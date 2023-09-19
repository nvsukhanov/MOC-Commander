import { createSelector } from '@ngrx/store';
import { ActivatedRouteSnapshot } from '@angular/router';
import {
    CONTROLLER_CONNECTION_SELECTORS,
    CONTROLLER_SELECTORS,
    CONTROLLER_SETTINGS_SELECTORS,
    ControllerModel,
    ControllerSettingsModel,
    ROUTER_SELECTORS
} from '@app/store';

export type ControllerPageViewModel = {
    controller: ControllerModel;
    settings: ControllerSettingsModel;
    isConnected: boolean;
};

export const CONTROLLER_PAGE_SELECTORS = {
    selectViewModel: createSelector(
        ROUTER_SELECTORS.selectCurrentRoute,
        CONTROLLER_SELECTORS.selectEntities,
        CONTROLLER_CONNECTION_SELECTORS.selectEntities,
        CONTROLLER_SETTINGS_SELECTORS.selectEntities,
        (route: ActivatedRouteSnapshot | undefined, controllerEntities, connectionEntities, settingsEntities): ControllerPageViewModel | null => {
            const rawId = route?.params?.['id'] ?? null;
            if (rawId === null) {
                return null;
            }
            const id = decodeURI(rawId);
            const controller = controllerEntities[id];
            const connection = connectionEntities[id];
            const settings = settingsEntities[id];
            if (controller === undefined || settings === undefined) {
                return null;
            }
            return {
                controller,
                settings,
                isConnected: !!connection
            };
        }
    )
};
