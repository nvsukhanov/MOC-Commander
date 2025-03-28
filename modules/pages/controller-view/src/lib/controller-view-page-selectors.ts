import { createSelector } from '@ngrx/store';
import { ActivatedRouteSnapshot } from '@angular/router';
import {
  CONTROLLER_CONNECTION_SELECTORS,
  CONTROLLER_SELECTORS,
  CONTROLLER_SETTINGS_SELECTORS,
  ControllerModel,
  ControllerSettingsModel,
  ROUTER_SELECTORS,
} from '@app/store';

const SELECT_CURRENTLY_VIEWED_CONTROLLER_ID = createSelector(
  ROUTER_SELECTORS.selectCurrentRoute,
  (route: ActivatedRouteSnapshot | undefined): string | null => {
    const rawId = route?.params?.['id'] ?? null;
    if (rawId === null) {
      return null;
    }
    return decodeURI(rawId);
  },
);

export type ControllerPageViewModel = {
  controller: ControllerModel;
  settings: ControllerSettingsModel;
  isConnected: boolean;
};

export const CONTROLLER_VIEW_PAGE_SELECTORS = {
  selectCurrentlyViewedControllerId: SELECT_CURRENTLY_VIEWED_CONTROLLER_ID,
  selectViewModel: createSelector(
    SELECT_CURRENTLY_VIEWED_CONTROLLER_ID,
    CONTROLLER_SELECTORS.selectEntities,
    CONTROLLER_CONNECTION_SELECTORS.selectEntities,
    CONTROLLER_SETTINGS_SELECTORS.selectEntities,
    (id, controllerEntities, connectionEntities, settingsEntities): ControllerPageViewModel | null => {
      if (id === null) {
        return null;
      }
      const controller = controllerEntities[id];
      const connection = connectionEntities[id];
      const settings = settingsEntities[id];
      if (controller === undefined || settings === undefined) {
        return null;
      }
      return {
        controller,
        settings,
        isConnected: !!connection,
      };
    },
  ),
};
