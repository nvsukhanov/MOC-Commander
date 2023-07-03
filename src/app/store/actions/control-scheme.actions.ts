import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { ControlSchemeBinding } from '../models';

export const CONTROL_SCHEME_ACTIONS = createActionGroup({
    source: 'Control Schemes',
    events: {
        'create': props<{ id: string, name: string, bindings: ControlSchemeBinding[] }>(),
        'update': props<{ id: string, name: string, bindings: ControlSchemeBinding[] }>(),
        'delete': props<{ id: string }>(),

        'start scheme': props<{ schemeId: string }>(),
        'stop scheme': emptyProps(),

        'input rebind success': emptyProps(),
        'input rebind type mismatch': emptyProps(),
        'no IO for input found': emptyProps(),
        'servo calibration error': props<{ error: Error }>(),
    }
});
