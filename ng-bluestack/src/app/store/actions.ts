import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { ControllerType } from '../types';

export const ACTIONS_CONFIGURE_CONTROLLER = createActionGroup({
    source: 'configure controller',
    events: {
        'Set controller type': props<{ controllerType: ControllerType }>(),
        'Listen for gamepad': emptyProps(),
        'Listening for gamepad started': emptyProps(),
        'Cancel listening for gamepad': emptyProps(),
        'Listening for gamepad canceled': emptyProps(),
        'Gamepad connected': props<{ gamepad: Gamepad }>(),
        'Disconnect gamepad': props<{ id: string }>(),
        'Gamepad disconnected': props<{ id: string }>()
    }
});
