import { createActionGroup, props } from '@ngrx/store';

export const HUB_STATS_ACTIONS = createActionGroup({
    source: 'Hub Stats',
    events: {
        'battery level subscribe': props<{ hubId: string }>(),
        'battery level received': props<{ hubId: string, batteryLevel: null | number }>(),
        'battery level unsubscribe': props<{ hubId: string }>(),
        'rssi level subscribe': props<{ hubId: string }>(),
        'rssi level received': props<{ hubId: string, RSSI: null | number }>(),
        'rssi level unsubscribe': props<{ hubId: string }>(),
        'button state subscribe': props<{ hubId: string }>(),
        'button state received': props<{ hubId: string, isPressed: boolean }>(),
        'button state unsubscribe': props<{ hubId: string }>(),
        'set has communication': props<{ hubId: string, hasCommunication: boolean }>(),
    }
});
