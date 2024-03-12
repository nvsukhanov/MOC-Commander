import { createActionGroup, props } from '@ngrx/store';

export const ATTACHED_IO_PROPS_ACTIONS = createActionGroup({
    source: 'Attached IO Props',
    events: {
        'motor encoder offset received': props<{ hubId: string; portId: number; offset: number }>(),
        'startup servo calibration data received': props<{ hubId: string; portId: number; range: number; aposCenter: number }>(),
        'startup motor position received': props<{ hubId: string; portId: number; position: number }>(),
        'compensate pitch': props<{ hubId: string; portId: number; currentPitch: number }>(),
        'compensate yaw': props<{ hubId: string; portId: number; currentYaw: number }>(),
        'compensate roll': props<{ hubId: string; portId: number; currentRoll: number }>(),
        'reset pitch compensation': props<{ hubId: string; portId: number }>(),
        'reset yaw compensation': props<{ hubId: string; portId: number }>(),
        'reset roll compensation': props<{ hubId: string; portId: number }>(),
    }
});
