import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { ControllerModel } from './controller-model';

export const CONTROLLERS_ACTIONS = createActionGroup({
    source: 'Controllers',
    events: {
        'wait for connect': emptyProps(),
        'connected': props<ControllerModel>(),
        'disconnect': props<Pick<ControllerModel, 'id'>>(),
        'disconnected': props<Pick<ControllerModel, 'id'>>(),
    }
});