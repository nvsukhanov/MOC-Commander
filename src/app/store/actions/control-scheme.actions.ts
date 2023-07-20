import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const CONTROL_SCHEME_ACTIONS = createActionGroup({
    source: 'Control Schemes',
    events: {
        'start scheme': props<{ schemeId: string }>(),
        'stop scheme': emptyProps(),

        'input rebind success': emptyProps(),
        'input rebind type mismatch': emptyProps(),
        'no IO for input found': emptyProps(),
        'servo calibration error': props<{ error: Error }>(),
    }
});
