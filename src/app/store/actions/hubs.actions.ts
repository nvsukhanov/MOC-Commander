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
        'hub type received': props<{ hubId: string, hubType: HubType }>(),
        'request set hub name': props<{ hubId: string, name: string }>(),
        'hub name set': props<{ hubId: string, name: string }>(),
        'forget hub': props<{ hubId: string }>(),
    }
});
