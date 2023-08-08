import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { ControllerSettings } from '../../controller-profiles';

export const CONTROLLERS_ACTIONS = createActionGroup({
    source: 'Controllers',
    events: {
        'wait for connect': emptyProps(),
        'keyboardDiscovered': props<{ profileUid: string; settings: ControllerSettings }>(),
        'keyboardConnected': props<{ profileUid: string }>(),
        'gamepadDiscovered': props<{
            id: string;
            profileUid: string;
            axesCount: number;
            buttonsCount: number;
            triggerButtonsIndices: number[];
            gamepadApiIndex: number;
            gamepadOfTypeIndex: number;
            settings: ControllerSettings;
        }>(),
        'gamepadConnected': props<{ id: string; gamepadApiIndex: number; profileUid: string }>(),
        'gamepadDisconnected': props<{ id: string }>(),
    }
});
