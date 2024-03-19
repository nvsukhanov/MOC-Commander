import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { ControllerInputModel } from '../models';

export const CONTROLLER_INPUT_ACTIONS = createActionGroup({
    source: 'Controller Input',
    events: {
        requestInputCapture: emptyProps(),
        releaseInputCapture: emptyProps(),
        inputReceived: props<{ nextState: ControllerInputModel }>()
    }
});
