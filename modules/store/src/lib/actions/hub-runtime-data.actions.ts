import { createActionGroup, props } from '@ngrx/store';

export const HUB_RUNTIME_DATA_ACTIONS = createActionGroup({
    source: 'Hub runtime data',
    events: {
        'battery level subscribe': props<{ hubId: string }>(),
        'battery level received': props<{ hubId: string; batteryLevel: null | number }>(),
        'battery level unsubscribe': props<{ hubId: string }>(),
        'rssi level subscribe': props<{ hubId: string }>(),
        'rssi level received': props<{ hubId: string; rssi: null | number }>(),
        'rssi level unsubscribe': props<{ hubId: string }>(),
        'button state subscribe': props<{ hubId: string }>(),
        'button state received': props<{ hubId: string; isButtonPressed: boolean }>(),
        'button state unsubscribe': props<{ hubId: string }>(),
        'set has communication': props<{ hubId: string; hasCommunication: boolean }>(),
        'set hardware version': props<{ hubId: string; hardwareVersion: string }>(),
        'set firmware version': props<{ hubId: string; firmwareVersion: string }>(),
    }
});
