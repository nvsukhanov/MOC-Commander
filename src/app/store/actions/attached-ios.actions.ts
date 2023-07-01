import { createActionGroup, props } from '@ngrx/store';

import { AttachedIoModel } from '../models';

export const ATTACHED_IOS_ACTIONS = createActionGroup({
    source: 'Attached IOs',
    events: {
        'io connected': props<{ io: AttachedIoModel }>(),
        'io disconnected': props<{ hubId: string, portId: number }>(),
    }
});
