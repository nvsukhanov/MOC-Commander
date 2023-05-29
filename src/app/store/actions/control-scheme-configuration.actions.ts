import { createActionGroup, emptyProps } from '@ngrx/store';

export const CONTROL_SCHEME_CONFIGURATION_ACTIONS = createActionGroup({
    source: 'Control Scheme Configuration',
    events: {
        'start listening': emptyProps(),
        'stop listening': emptyProps(),
    }
});
