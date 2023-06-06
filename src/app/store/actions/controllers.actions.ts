import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { Controller } from '../i-state';

export const CONTROLLERS_ACTIONS = createActionGroup({
    source: 'Controllers',
    events: {
        'wait for connect': emptyProps(),
        'connected': props<Controller>(),
        'disconnect': props<Pick<Controller, 'id'>>(),
        'disconnected': props<Pick<Controller, 'id'>>(),
    }
});
