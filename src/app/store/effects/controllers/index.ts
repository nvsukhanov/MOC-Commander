import { FunctionalEffect } from '@ngrx/effects';

import { CAPTURE_GAMEPAD_INPUT, CAPTURE_HUB_BUTTON_GROUPS_INPUT, CAPTURE_HUB_GREEN_BUTTON_INPUT, CAPTURE_KEYBOARD_INPUT } from './capture-input';
import { LISTEN_GAMEPAD_CONNECT, LISTEN_HUB_CONNECT, LISTEN_KEYBOARD_CONNECT } from './listen-connect';
import { LISTEN_GAMEPAD_DISCONNECT, LISTEN_HUB_DISCONNECT } from './listen-disconnect';

export * from '../../controller-profile-factory.service';

export const CONTROLLER_EFFECTS: { [name: string]: FunctionalEffect } = {
    gamepadInput: CAPTURE_GAMEPAD_INPUT,
    gamepadConnect: LISTEN_GAMEPAD_CONNECT,
    gamepadDisconnect: LISTEN_GAMEPAD_DISCONNECT,
    keyboardConnect: LISTEN_KEYBOARD_CONNECT,
    keyboardInput: CAPTURE_KEYBOARD_INPUT,
    hubConnect: LISTEN_HUB_CONNECT,
    hubDisconnect: LISTEN_HUB_DISCONNECT,
    hubGreenButtonInput: CAPTURE_HUB_GREEN_BUTTON_INPUT,
    hubButtonGroupsInput: CAPTURE_HUB_BUTTON_GROUPS_INPUT
};
