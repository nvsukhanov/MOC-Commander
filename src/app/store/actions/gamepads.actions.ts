import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { GamepadAxisState, GamepadButtonState, GamepadConfig } from '../i-state';

export const GAMEPAD_ACTIONS = createActionGroup({
    source: 'GAMEPAD_ACTIONS',
    events: {
        'listen gamepad connected': emptyProps(),
        'gamepad connected': props<{ gamepad: GamepadConfig }>(),
        'gamepad disconnected': props<{ gamepadIndex: number }>(),
        'gamepads read start': emptyProps(),
        'gamepads read stop': emptyProps(),
        'update gamepads values': props<{ axesState: GamepadAxisState[], buttonsState: GamepadButtonState[] }>(),
    }
});
