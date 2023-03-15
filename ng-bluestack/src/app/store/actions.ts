import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { GamepadControllerConfig } from './i-state';

export const ACTIONS_CONFIGURE_CONTROLLER = createActionGroup({
    source: 'configure controller',
    events: {
        'Listen for gamepad': emptyProps(),
        'Listening for gamepad started': emptyProps(),
        'Cancel listening for gamepad': emptyProps(),
        'Listening for gamepad canceled': emptyProps(),
        'Gamepad connected': props<{ gamepad: GamepadControllerConfig }>(),
        'Disconnect gamepad': props<{ index: number }>(),
        'Gamepad disconnected': props<{ id: string }>()
    }
});
