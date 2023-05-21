import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const SERVO_CALIBRATION_ACTIONS = createActionGroup({
    source: 'SERVO_CALIBRATION_ACTIONS',
    events: {
        'start calibration': props<{ hubId: string, portId: number, power: number }>(),
        'cancel calibration': emptyProps(),
        'calibration finished': props<{ hubId: string, portId: number, min: number, max: number }>(),
        'calibration cancelled': emptyProps(),
        'calibration error': props<{ error: Error }>(),
    }
});
