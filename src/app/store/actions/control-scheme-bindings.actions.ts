import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { GamepadInputMethod } from '../i-state';

export const CONTROL_SCHEME_BINDINGS_ACTIONS = createActionGroup({
    source: 'CONTROL_SCHEME_BINDINGS_ACTIONS',
    events: {
        'gamepad input listen': props<{ schemeId: string }>(),
        'gamepad input stop listening': emptyProps(),
        'gamepad input received': props<{
            schemeId: string,
            gamepadId: number,
            inputType: GamepadInputMethod,
            gamepadAxisId: number | null,
            gamepadButtonId: number | null
        }>()
    }
});
