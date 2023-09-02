import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { ControlSchemeBinding, ControlSchemeModel, ControlSchemePortConfig } from '../models';

export const CONTROL_SCHEME_ACTIONS = createActionGroup({
    source: 'Control Schemes',
    events: {
        'create control scheme': props<{ name: string }>(),
        'update control scheme name': props<{ previousName: string; name: string }>(),
        'delete control scheme': props<{ name: string }>(),
        'copy export string': props<{ exportString: string }>(),
        'import control scheme': props<{ scheme: ControlSchemeModel }>(),

        'save binding': props<{ schemeName: string; binding: ControlSchemeBinding }>(),
        'create binding': props<{ schemeName: string; binding: ControlSchemeBinding }>(),
        'delete binding': props<{ schemeName: string; bindingId: number }>(),
        'save port config': props<{ schemeName: string; portConfig: ControlSchemePortConfig }>(),

        'start scheme': props<{ name: string }>(),
        'scheme started': props<{ name: string }>(),
        'stop scheme': emptyProps(),
        'scheme stopped': emptyProps(),

        'servo calibration error': props<{ error: Error }>(),
    }
});
