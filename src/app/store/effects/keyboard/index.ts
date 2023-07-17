// export * from './keyboard-controller-input.effects';

import { FunctionalEffect } from '@ngrx/effects';

import { LISTEN_KEYBOARD_CONNECT } from './listen-keyboard-connect.effect';
import { CAPTURE_KEYBOARD_INPUT } from './capture-keyboard-input.effect';

export const KEYBOARD_CONTROLLER_EFFECTS: { [k in string]: FunctionalEffect } = {
    keyboardConnect: LISTEN_KEYBOARD_CONNECT,
    captureInput: CAPTURE_KEYBOARD_INPUT
};
