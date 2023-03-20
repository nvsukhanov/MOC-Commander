import { createAction, createActionGroup, emptyProps, props } from '@ngrx/store';
import { ControllerAxesState, ControllerButtonsState, GamepadControllerConfig } from '../i-state';

export const ACTIONS_CONFIGURE_CONTROLLER = createActionGroup({
    source: 'ACTIONS_CONFIGURE_CONTROLLER',
    events: {
        'Listen for gamepad': emptyProps(),
        'Keyboard connected': emptyProps(),
        'Keyboard disconnected': emptyProps(),
        'Listening for gamepad started': emptyProps(),
        'Cancel listening for gamepad': emptyProps(),
        'Listening for gamepad canceled': emptyProps(),
        'Gamepad connected': props<{ gamepad: GamepadControllerConfig }>(),
        'Disconnect gamepad': props<{ index: number }>(),
        'Gamepad disconnected': props<{ id: string }>()
    }
});

export const ACTION_CONTROLLER_READ = createAction('read controller', props<{
    axes: ControllerAxesState,
    buttons: ControllerButtonsState
}>());

export const ACTION_KEYBOARD_EVENTS = createActionGroup({
    source: 'ACTION_KEYBOARD_EVENTS',
    events: {
        'key down': props<{ code: number }>(),
        'key up': props<{ code: number }>(),
    }
});
