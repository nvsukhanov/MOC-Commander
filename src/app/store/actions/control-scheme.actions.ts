import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const CONTROL_SCHEME_ACTIONS = createActionGroup({
    source: 'Control Schemes',
    events: {
        'create': emptyProps(),
        'created': props<{ id: string, index: number, name: string; }>(),
        'delete': props<{ id: string }>()
    }
});
