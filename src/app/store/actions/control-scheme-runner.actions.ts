import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const CONTROL_SCHEME_RUNNER_ACTIONS = createActionGroup({
    source: 'Control Scheme Runner',
    events: {
        'run scheme': props<{ schemeId: string }>(),
        'mark scheme as running': props<{ schemeId: string }>(),
        'stop running': emptyProps()
    }
});
