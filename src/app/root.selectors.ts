import { createSelector } from '@ngrx/store';
import { CONTROL_SCHEME_SELECTORS, ControlSchemeRunState, HUBS_SELECTORS, HUB_EDIT_FORM_ACTIVE_SAVES_SELECTORS } from '@app/store';

export const ROOT_SELECTORS = {
    shouldShowProgressBar: createSelector(
        HUBS_SELECTORS.selectIsDiscovering,
        CONTROL_SCHEME_SELECTORS.selectRunningState,
        HUB_EDIT_FORM_ACTIVE_SAVES_SELECTORS.isAnyHubSaveInProgress,
        (isDiscovering, schemeRunningState, isHubSaving) => {
            return isDiscovering ||
                schemeRunningState === ControlSchemeRunState.Starting ||
                schemeRunningState === ControlSchemeRunState.Stopping ||
                isHubSaving;
        }
    ),
};
