import { createSelector } from '@ngrx/store';
import { IOType } from 'rxpoweredup';

import { ATTACHED_IO_MODES_ENTITY_ADAPTER, ATTACHED_IO_MODES_FEATURE, attachedIoModesIdFn } from '../reducers';

export const ATTACHED_IO_MODES_SELECTORS = {
  selectAll: createSelector(
    ATTACHED_IO_MODES_FEATURE.selectAttachedIoModesState,
    ATTACHED_IO_MODES_ENTITY_ADAPTER.getSelectors().selectAll,
  ),
  selectEntities: createSelector(
    ATTACHED_IO_MODES_FEATURE.selectAttachedIoModesState,
    ATTACHED_IO_MODES_ENTITY_ADAPTER.getSelectors().selectEntities,
  ),
  selectIoPortModes: ({
    hardwareRevision,
    softwareRevision,
    ioType,
  }: {
    hardwareRevision: string;
    softwareRevision: string;
    ioType: IOType;
  }) =>
    createSelector(ATTACHED_IO_MODES_SELECTORS.selectAll, (state) => {
      return (
        state.find((item) => item.id === attachedIoModesIdFn({ hardwareRevision, softwareRevision, ioType })) ?? null
      );
    }),
  hasCachedIoPortModes: ({
    hardwareRevision,
    softwareRevision,
    ioType,
  }: {
    hardwareRevision: string;
    softwareRevision: string;
    ioType: IOType;
  }) =>
    createSelector(
      ATTACHED_IO_MODES_SELECTORS.selectIoPortModes({ hardwareRevision, softwareRevision, ioType }),
      (state) => state !== null,
    ),
} as const;
