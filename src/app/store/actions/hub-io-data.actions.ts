import { createActionGroup, props } from '@ngrx/store';

export const HUB_IO_DATA_ACTIONS = createActionGroup({
    source: 'HUB_IO_DATA_ACTIONS',
    events: {
        'update port value': props<{ hubId: string, portId: number, value: number[] }>(),
        'subscribe to port values': props<{ hubId: string, portId: number, modeId: number }>(),
        'subscribe to port values success': props<{ hubId: string, portId: number, modeId: number }>(),
        'unsubscribe from port values': props<{ hubId: string, portId: number }>()
    }
});
