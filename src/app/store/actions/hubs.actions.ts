import { HubType } from 'rxpoweredup';
import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const HUBS_ACTIONS = createActionGroup({
    source: 'Hubs',
    events: {
        'start discovery': emptyProps(),
        'connected': props<{ hubId: string; name: string }>(),
        'disconnected': props<{ hubId: string; name: string }>(),
        'device connect failed': props<{ error: Error }>(),
        'user requested hub disconnection': props<{ hubId: string }>(),
        'hub type received': props<{ hubId: string; hubType: HubType }>(),
        'request set hub name': props<{ hubId: string; name: string }>(),
        'hub name set': props<{ hubId: string; name: string }>(),
        'forget hub': props<{ hubId: string }>(),

        'request port position': props<{ hubId: string; portId: number }>(),
        'port position read': props<{ hubId: string; portId: number; position: number }>(),
        'port position read failed': props<{ hubId: string; portId: number; error: Error }>(),

        'request port absolute position': props<{ hubId: string; portId: number }>(),
        'port absolute position read': props<{ hubId: string; portId: number; position: number }>(),
        'port absolute position read failed': props<{ hubId: string; portId: number; error: Error }>(),
    }
});
