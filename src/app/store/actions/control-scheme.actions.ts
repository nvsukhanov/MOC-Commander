import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { ControlSchemeModel } from '../models';

export const CONTROL_SCHEME_ACTIONS = createActionGroup({
    source: 'Control Schemes',
    events: {
        'create': props<{ scheme: ControlSchemeModel }>(),
        'update': props<{ scheme: ControlSchemeModel }>(),
        'delete': props<{ id: string }>(),

        'start scheme': props<{ schemeId: string }>(),
        'stop scheme': emptyProps(),
        'scheme stopped': emptyProps(),

        'servo calibration error': props<{ error: Error }>(),
    }
});
