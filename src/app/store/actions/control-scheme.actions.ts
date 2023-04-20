import { createActionGroup, props } from '@ngrx/store';
import { ControlSchemeBinding } from '../i-state';

export const CONTROL_SCHEME_ACTIONS = createActionGroup({
    source: 'Control Schemes',
    events: {
        'create': props<{ id: string, name: string, bindings: ControlSchemeBinding[] }>(),
        'delete': props<{ id: string }>()
    }
});
