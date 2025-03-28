import { createActionGroup, props } from '@ngrx/store';

import { AttachedIoModel } from '../models';

export const ATTACHED_IO_MODES_ACTIONS = createActionGroup({
  source: 'Attached IO Modes',
  events: {
    portModesReceived: props<{
      io: AttachedIoModel;
      portInputModes: number[];
      portOutputModes: number[];
      synchronizable: boolean;
    }>(),
  },
});
