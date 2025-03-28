import { createSelector } from '@ngrx/store';
import { Dictionary } from '@ngrx/entity';
import {
  ATTACHED_IO_MODES_SELECTORS,
  ATTACHED_IO_PORT_MODE_INFO_SELECTORS,
  ATTACHED_IO_SELECTORS,
  AttachedIoModel,
  AttachedIoModesModel,
  AttachedIoPortModeInfoModel,
  CONTROL_SCHEME_SELECTORS,
  ControlSchemeRunState,
  WidgetConfigModel,
} from '@app/store';

import { CONTROL_SCHEME_PAGE_SELECTORS } from '../control-scheme-page.selectors';

export const WIDGETS_SECTION_SELECTORS = {
  canReorderWidgets: createSelector(CONTROL_SCHEME_PAGE_SELECTORS.selectCurrentlyViewedScheme, (scheme) => !!scheme && scheme.widgets.length > 1),
  addableWidgetConfigFactoryBaseData: (controlSchemeName: string) =>
    createSelector(
      CONTROL_SCHEME_SELECTORS.selectRunningState,
      CONTROL_SCHEME_SELECTORS.selectScheme(controlSchemeName),
      ATTACHED_IO_SELECTORS.selectAll,
      ATTACHED_IO_MODES_SELECTORS.selectEntities,
      ATTACHED_IO_PORT_MODE_INFO_SELECTORS.selectEntities,
      (
        schemeRunningState,
        controlScheme,
        attachedIos,
        ioPortModes,
        portModesInfo,
      ): {
        ios: AttachedIoModel[];
        portModes: Dictionary<AttachedIoModesModel>;
        portModesInfo: Dictionary<AttachedIoPortModeInfoModel>;
        existingWidgets: WidgetConfigModel[];
      } => {
        if (!controlScheme || schemeRunningState !== ControlSchemeRunState.Idle) {
          return {
            ios: [],
            portModes: {},
            portModesInfo: {},
            existingWidgets: [],
          };
        }

        return {
          ios: attachedIos,
          portModes: ioPortModes,
          portModesInfo: portModesInfo,
          existingWidgets: controlScheme.widgets,
        };
      },
    ),
} as const;
