import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { ControlSchemeBinding, ControlSchemePortConfig } from '../models';

export const CONTROL_SCHEME_ACTIONS = createActionGroup({
    source: 'Control Schemes',
    events: {
        'create control scheme': props<{ name: string; id: string }>(),
        'update control scheme name': props<{ id: string; name: string }>(),
        'delete control scheme': props<{ id: string }>(),

        'save binding': props<{ schemeId: string; binding: ControlSchemeBinding }>(),
        'create binding': props<{ schemeId: string; binding: ControlSchemeBinding }>(),
        'delete binding': props<{ schemeId: string; bindingId: string }>(),
        'save port config': props<{ schemeId: string; portConfig: ControlSchemePortConfig }>(),

        'start scheme': props<{ schemeId: string }>(),
        'scheme started': props<{ schemeId: string }>(),
        'stop scheme': emptyProps(),
        'scheme stopped': emptyProps(),

        'servo calibration error': props<{ error: Error }>(),
    }
});
