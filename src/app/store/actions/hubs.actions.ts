import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { HubType } from '@nvsukhanov/rxpoweredup';

export const HUBS_ACTIONS = createActionGroup({
    source: 'HUBS_ACTIONS',
    events: {
        'start discovery': emptyProps(),
        'connected': props<{ hubId: string, name: string }>(),
        'disconnected': props<{ hubId: string, name: string }>(),
        'device connect failed': props<{ error: Error }>(),
        'user requested hub disconnection': props<{ hubId: string }>(),
        'battery level subscribe': props<{ hubId: string }>(),
        'battery level received': props<{ hubId: string, batteryLevel: null | number }>(),
        'battery level unsubscribe': props<{ hubId: string }>(),
        'RSSI level subscribe': props<{ hubId: string }>(),
        'RSSI level received': props<{ hubId: string, RSSI: null | number }>(),
        'RSSI level unsubscribe': props<{ hubId: string }>(),
        'button state subscribe': props<{ hubId: string }>(),
        'button state received': props<{ hubId: string, isPressed: boolean }>(),
        'button state unsubscribe': props<{ hubId: string }>(),
        'hub type received': props<{ hubId: string, hubType: HubType }>(),
        'set has communication': props<{ hubId: string, hasCommunication: boolean }>(),
        'request set hub name': props<{ hubId: string, name: string }>(),
        'hub name set': props<{ hubId: string, name: string }>()
    }
});
