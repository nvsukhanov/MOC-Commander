import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { BindingFormResult } from '../../control-schemes/edit';

export const CONTROL_SCHEME_ACTIONS = createActionGroup({
    source: 'Control Schemes',
    events: {
        'create': props<BindingFormResult>(),
        'update': props<BindingFormResult>(),
        'delete': props<{ id: string }>(),
        'run scheme': props<{ schemeId: string }>(),
        'mark scheme as running': props<{ schemeId: string }>(),
        'stop running': emptyProps(),
        'input rebind success': emptyProps(),
        'input rebind type mismatch': emptyProps(),
        'no IO for input found': emptyProps(),
    }
});
