import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { ControlSchemeBinding } from '../i-state';

export const CONTROL_SCHEME_ACTIONS = createActionGroup({
    source: 'Control Schemes',
    events: {
        'create': props<{ id: string, name: string, bindings: ControlSchemeBinding[] }>(),
        'delete': props<{ id: string }>(),
        'run scheme': props<{ schemeId: string }>(),
        'mark scheme as running': props<{ schemeId: string }>(),
        'stop running': emptyProps()
    }
});
