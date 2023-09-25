import { createSelector } from '@ngrx/store';
import { CONTROLLER_CONNECTION_SELECTORS, CONTROLLER_SELECTORS, CONTROLLER_SETTINGS_SELECTORS, ControllerModel } from '@app/store';
import { ControllerType } from '@app/shared';

export type ControllerListViewModel = Array<{
    isConnected: boolean;
    isInputIgnored: boolean;
    canForget: boolean;
} & ControllerModel>;

export const CONTROLLERS_LIST_PAGE_SELECTORS = {
    viewModel: createSelector(
        CONTROLLER_SELECTORS.selectAll,
        CONTROLLER_SETTINGS_SELECTORS.selectEntities,
        CONTROLLER_CONNECTION_SELECTORS.selectEntities,
        (controllers, controllerSettingsEntities, connectionStateEntities): ControllerListViewModel => controllers.map((controller) => {
            const canForget = controller.controllerType !== ControllerType.Hub;
            return {
                ...controller,
                isInputIgnored: controllerSettingsEntities[controller.id]?.ignoreInput ?? false,
                isConnected: !!connectionStateEntities[controller.id],
                canForget,
            };
        })
    ),
} as const;
