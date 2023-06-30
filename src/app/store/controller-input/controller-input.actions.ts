import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { ControllerInputModel } from './controller-input.model';

export const CONTROLLER_INPUT_ACTIONS = createActionGroup({
    source: 'Controller Input',
    events: {
        'request input capture': emptyProps(),
        'release input capture': emptyProps(),
        'input capturing': emptyProps(),
        'input capture released': emptyProps(),
        'input received': props<ControllerInputModel>()
    }
});
