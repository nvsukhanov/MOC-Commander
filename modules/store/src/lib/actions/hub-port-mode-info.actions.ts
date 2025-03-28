import { createActionGroup, props } from '@ngrx/store';
import { IOType } from 'rxpoweredup';

import { AttachedIoPortModeInfoModel } from '../models';

export const HUB_PORT_MODE_INFO_ACTIONS = createActionGroup({
  source: 'HUB_PORT_MODE_INFO_ACTIONS',
  events: {
    portModeDataRequest: props<{
      hubId: string;
      portId: number;
      modeId: number;
      ioType: IOType;
      hardwareRevision: string;
      softwareRevision: string;
    }>(),
    addPortModeData: props<{
      dataSets: AttachedIoPortModeInfoModel[];
    }>(),
  },
});
