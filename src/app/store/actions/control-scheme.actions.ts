import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const CONTROL_SCHEME_ACTIONS = createActionGroup({
    source: 'Control Schemes',
    events: {
        'create': emptyProps(),
        'delete': props<{ id: string }>()
    }
});
