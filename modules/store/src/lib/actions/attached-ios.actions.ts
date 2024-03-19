import { createActionGroup, props } from '@ngrx/store';

import { AttachedIoModel } from '../models';

export const ATTACHED_IOS_ACTIONS = createActionGroup({
    source: 'Attached IOs',
    events: {
        ioConnected: props<{ io: AttachedIoModel }>(),
        ioDisconnected: props<{ hubId: string; portId: number }>(),
    }
});
