import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { GamepadAxisState, GamepadButtonState, GamepadConfig, GamepadInputMethod } from '../i-state';

export const GAMEPAD_ACTIONS = createActionGroup({
    source: 'GAMEPAD_ACTIONS',
    events: {
        'listen gamepad connected': emptyProps(),
        'gamepad connected': props<{ gamepad: GamepadConfig }>(),
        'gamepad disconnected': props<{ gamepadIndex: number }>(),
        'gamepads read start': emptyProps(),
        'gamepads read stop': emptyProps(),
        'update gamepads values': props<{ axesState: GamepadAxisState[], buttonsState: GamepadButtonState[] }>(),
        'gamepad wait for user input': emptyProps(),
        'gamepad wait for user input cancel': emptyProps(),
        'gamepad user input received': props<{
            gamepadId: number,
            inputMethod: GamepadInputMethod,
            gamepadAxisId: number | null,
            gamepadButtonId: number | null
        }>(),
    }
});
