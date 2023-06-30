import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { ControllerInputType } from '@app/shared';

export const CONTROLLER_INPUT_ACTIONS = createActionGroup({
    source: 'Controller Input',
    events: {
        'request input capture': emptyProps(),
        'release input capture': emptyProps(),
        'input capturing': emptyProps(),
        'input capture released': emptyProps(),
        'input received': props<{
            controllerId: string;
            inputType: ControllerInputType;
            inputId: string;
            value: number;
        }>()
    }
});
