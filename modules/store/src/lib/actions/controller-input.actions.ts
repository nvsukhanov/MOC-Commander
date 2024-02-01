import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { ControllerInputModel } from '../models';

export const CONTROLLER_INPUT_ACTIONS = createActionGroup({
    source: 'Controller Input',
    events: {
        'request input capture': emptyProps(),
        'release input capture': emptyProps(),
        'input received': props<{ nextState: ControllerInputModel }>()
    }
});
