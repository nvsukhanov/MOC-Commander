import { createSelector } from '@ngrx/store';
import { ATTACHED_IO_MODES_SELECTORS, ATTACHED_IO_PORT_MODE_INFO_SELECTORS, ATTACHED_IO_SELECTORS, CONTROL_SCHEME_SELECTORS } from '@app/store';

import { areControllableIosPresent } from '../common';

export const CONTROL_SCHEMES_LIST_PAGE_SELECTORS = {
    selectSchemesList: createSelector(
        CONTROL_SCHEME_SELECTORS.selectAll,
        CONTROL_SCHEME_SELECTORS.selectRunningSchemeName,
        (schemes, runningSchemeName) => {
            return schemes.map((scheme) => ({
                ...scheme,
                isRunning: scheme.name === runningSchemeName
            }));
        }
    ),
    canCreateScheme: createSelector(
        ATTACHED_IO_SELECTORS.selectAll,
        ATTACHED_IO_MODES_SELECTORS.selectEntities,
        ATTACHED_IO_PORT_MODE_INFO_SELECTORS.selectEntities,
        (ios, ioSupportedModesEntities, portModeInfoEntities) => areControllableIosPresent(ios, ioSupportedModesEntities, portModeInfoEntities)
    ),
} as const;
