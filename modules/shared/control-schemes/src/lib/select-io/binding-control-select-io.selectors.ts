import { MemoizedSelector, createSelector } from '@ngrx/store';
import { ControlSchemeBindingType } from '@app/shared-misc';
import { ATTACHED_IO_MODES_SELECTORS, ATTACHED_IO_PORT_MODE_INFO_SELECTORS, ATTACHED_IO_SELECTORS, AttachedIoModel } from '@app/store';

import { isIoControllableByBindingType } from '../is-io-controllable-by-binding-type';

export const BINDING_CONTROL_SELECT_IO_SELECTORS = {
  selectControllableIos: ({ hubId, bindingType }: { hubId: string; bindingType: ControlSchemeBindingType }): MemoizedSelector<object, AttachedIoModel[]> =>
    createSelector(
      ATTACHED_IO_SELECTORS.selectAll,
      ATTACHED_IO_MODES_SELECTORS.selectEntities,
      ATTACHED_IO_PORT_MODE_INFO_SELECTORS.selectEntities,
      (attachedIos, attachedIoModesEntities, attachedIoPortModeInfoEntities): AttachedIoModel[] => {
        return attachedIos.filter((io) => {
          return io.hubId === hubId && isIoControllableByBindingType(io, attachedIoModesEntities, attachedIoPortModeInfoEntities, bindingType);
        });
      },
    ),
};
