import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { GamepadInputMethod } from '../i-state';

export const CONTROL_SCHEME_BINDINGS_ACTIONS = createActionGroup({
    source: 'CONTROL_SCHEME_BINDINGS_ACTIONS',
    events: {
        'gamepad input listen': emptyProps(),
        'gamepad input stop listening': emptyProps(),
        'gamepad input received': props<{
            gamepadId: number,
            inputMethod: GamepadInputMethod,
            gamepadAxisId: number | null,
            gamepadButtonId: number | null
        }>(),
        'bind hub to control scheme': props<{ schemeId: string, hubId: string }>(),
    }
});
