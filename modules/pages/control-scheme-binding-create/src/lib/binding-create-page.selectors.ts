import { createSelector } from '@ngrx/store';
import {
  ATTACHED_IO_MODES_SELECTORS,
  ATTACHED_IO_PORT_MODE_INFO_SELECTORS,
  ATTACHED_IO_SELECTORS,
  ControlSchemeBinding,
  HUBS_SELECTORS,
} from '@app/store';
import { getIoOutputPortModeNames, getOperationModesByPortModes } from '@app/shared-control-schemes';

export const BINDING_CREATE_PAGE_SELECTORS = {
  selectDataForNewBinding: createSelector(
    HUBS_SELECTORS.selectAll,
    ATTACHED_IO_SELECTORS.selectAll,
    ATTACHED_IO_MODES_SELECTORS.selectEntities,
    ATTACHED_IO_PORT_MODE_INFO_SELECTORS.selectEntities,
    (
      hubs,
      attachedIos,
      attachedIoModesEntities,
      attachedIoPortModeInfoEntities,
    ): Partial<ControlSchemeBinding> | null => {
      for (const hub of hubs) {
        const hubIos = attachedIos.filter((io) => io.hubId === hub.hubId);
        for (const io of hubIos) {
          const inputPortModeNames = getIoOutputPortModeNames(
            io,
            attachedIoModesEntities,
            attachedIoPortModeInfoEntities,
          );
          const availableBindingTypes = getOperationModesByPortModes(inputPortModeNames);
          if (availableBindingTypes.length > 0) {
            return {
              hubId: hub.hubId,
              portId: io.portId,
              bindingType: availableBindingTypes[0],
            };
          }
        }
      }
      return null;
    },
  ),
} as const;
