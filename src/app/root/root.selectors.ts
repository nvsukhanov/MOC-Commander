import { createSelector } from '@ngrx/store';
import { CONTROL_SCHEME_SELECTORS, ControlSchemeRunState, HUBS_SELECTORS } from '@app/store';

export const ROOT_SELECTORS = {
    shouldShowProgressBar: createSelector(
        HUBS_SELECTORS.selectIsDiscovering,
        CONTROL_SCHEME_SELECTORS.selectRunningState,
        (isDiscovering, schemeRunningState) => {
            return isDiscovering || schemeRunningState === ControlSchemeRunState.Starting || schemeRunningState === ControlSchemeRunState.Stopping;
        }
    ),
};
