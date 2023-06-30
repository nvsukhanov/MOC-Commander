import { createActionGroup, props } from '@ngrx/store';

import { AttachedIo } from '../i-state';

export const HUB_ATTACHED_IOS_ACTIONS = createActionGroup({
    source: 'Hub Attached IOs',
    events: {
        'io connected': props<{ io: AttachedIo }>(),
        'io disconnected': props<{ hubId: string, portId: number }>(),
    }
});
