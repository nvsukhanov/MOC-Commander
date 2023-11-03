import { createActionGroup, props } from '@ngrx/store';
import { TiltData } from 'rxpoweredup';

export const ATTACHED_IO_PROPS_ACTIONS = createActionGroup({
    source: 'Attached IO Props',
    events: {
        'motor encoder offset received': props<{ hubId: string; portId: number; offset: number }>(),
        'startup servo calibration data received': props<{ hubId: string; portId: number; range: number; aposCenter: number }>(),
        'compensate tilt': props<{ hubId: string; portId: number; compensationData: TiltData }>(),
        'reset tilt compensation': props<{ hubId: string; portId: number }>(),
    }
});
