import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { BindingFormResult } from '../../control-schemes/edit';

export const CONTROL_SCHEME_ACTIONS = createActionGroup({
    source: 'Control Schemes',
    events: {
        'create': props<BindingFormResult>(),
        'update': props<BindingFormResult>(),
        'delete': props<{ id: string }>(),

        'start scheme': props<{ schemeId: string }>(),
        'scheme started': props<{ schemeId: string }>(),
        'scheme start error': props<{ schemeId: string }>(),
        'stop scheme': emptyProps(),
        'scheme stopped': emptyProps(),
        'scheme stop error': emptyProps(),

        'input rebind success': emptyProps(),
        'input rebind type mismatch': emptyProps(),
        'no IO for input found': emptyProps(),
    }
});
