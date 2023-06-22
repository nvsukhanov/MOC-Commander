import { createSelector } from '@ngrx/store';

import { HUB_DISCOVERY_STATE_SELECTORS } from './hub-discovery-state.selectors';
import { CONTROL_SCHEME_RUNNING_STATE_SELECTORS } from './control-scheme-running-state.selectors';
import { ControlSchemeRunStage } from '../i-state';

export const GLOBAL_PROGRESS_BAR_SELECTORS = {
    shouldShowProgressBar: createSelector(
        HUB_DISCOVERY_STATE_SELECTORS.isDiscoveryBusy,
        CONTROL_SCHEME_RUNNING_STATE_SELECTORS.selectRunningSchemeStage,
        (isDiscoveryBusy, runningSchemeStage) => {
            return isDiscoveryBusy
                || runningSchemeStage === ControlSchemeRunStage.Cleanup
                || runningSchemeStage === ControlSchemeRunStage.Preparing;
        }
    ),
} as const;
