import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { ControllerInput } from '../i-state';

export const CONTROLLER_INPUT_ACTIONS = createActionGroup({
    source: 'ControllerInput',
    events: {
        'request input capture': emptyProps(),
        'release input capture': emptyProps(),
        'input capturing': emptyProps(),
        'input capture released': emptyProps(),
        'input received': props<ControllerInput>()
    }
});
