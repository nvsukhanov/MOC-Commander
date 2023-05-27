import { createActionGroup, props } from '@ngrx/store';

export const HUB_ATTACHED_IOS_STATE_ACTIONS = createActionGroup({
    source: 'HUB_ATTACHED_IOS_STATE_ACTIONS',
    events: {
        'motor encoder offset received': props<{ hubId: string, portId: number, offset: number }>(),
    }
});
