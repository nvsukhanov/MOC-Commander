import { FunctionalEffect } from '@ngrx/effects';

import { LISTEN_GAMEPAD_CONNECT } from './listen-gamepad-connect.effect';
import { LISTEN_GAMEPAD_DISCONNECT } from './listen-gamepad-disconnect.effect';
import { CAPTURE_GAMEPAD_INPUT } from './capture-gamepad-input.effect';

export const GAMEPAD_CONTROLLER_EFFECTS: { [k in string]: FunctionalEffect } = {
    gamepadConnect: LISTEN_GAMEPAD_CONNECT,
    gamepadDisconnect: LISTEN_GAMEPAD_DISCONNECT,
    captureInput: CAPTURE_GAMEPAD_INPUT
};
