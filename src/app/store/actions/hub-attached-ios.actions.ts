import { createActionGroup, props } from '@ngrx/store';

import { AttachedIO } from '../i-state';

export const HUB_ATTACHED_IOS_ACTIONS = createActionGroup({
    source: 'Hub Attached IOs',
    events: {
        'io connected': props<{ io: AttachedIO }>(),
        'io disconnected': props<{ hubId: string, portId: number }>()
    }
});
