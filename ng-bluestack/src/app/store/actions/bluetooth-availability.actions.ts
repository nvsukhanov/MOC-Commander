import { createActionGroup, props } from '@ngrx/store';

export const ACTIONS_BLUETOOTH_AVAILABILITY = createActionGroup({
    source: 'BLUETOOTH_AVAILABILITY_ACTIONS',
    events: {
        'set bluetooth availability': props<{ isAvailable: boolean }>(),
    }
});
