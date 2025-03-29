import { createSelector } from '@ngrx/store';
import {
  ATTACHED_IO_MODES_SELECTORS,
  ATTACHED_IO_PORT_MODE_INFO_SELECTORS,
  ATTACHED_IO_SELECTORS,
  CONTROL_SCHEME_SELECTORS,
  ControlSchemeModel,
} from '@app/store';
import { areControllableIosPresent } from '@app/shared-control-schemes';

import { CONTROL_SCHEME_PAGE_SELECTORS } from '../control-scheme-page.selectors';

export const BINDING_LIST_SELECTORS = {
  selectSchemeHubsIds: createSelector(
    CONTROL_SCHEME_PAGE_SELECTORS.selectCurrentlyViewedScheme,
    (scheme: ControlSchemeModel | undefined): string[] => {
      const hubIds = new Set<string>();
      if (scheme) {
        for (const binding of scheme.bindings) {
          hubIds.add(binding.hubId);
        }
      }
      return [...hubIds];
    },
  ),
  canAddBinding: createSelector(
    ATTACHED_IO_SELECTORS.selectAll,
    ATTACHED_IO_MODES_SELECTORS.selectEntities,
    ATTACHED_IO_PORT_MODE_INFO_SELECTORS.selectEntities,
    CONTROL_SCHEME_SELECTORS.selectIsAnySchemeRunning,
    (ios, ioSupportedModesEntities, portModeInfoEntities, isAnySchemeRunning) => {
      return !isAnySchemeRunning && areControllableIosPresent(ios, ioSupportedModesEntities, portModeInfoEntities);
    },
  ),
} as const;
