import { FunctionalEffect } from '@ngrx/effects';

import { LISTEN_HUB_CONNECT } from './listen-hub-connect.effect';
import { LISTEN_KEYBOARD_CONNECT } from './listen-keyboard-connect.effect';
import { LISTEN_GAMEPAD_CONNECT } from './listen-gamepad-connect.effect';
import { NOTIFY_ON_HUB_KEYBOARD_DISCOVERED_EFFECT } from './notify-on-keyboard-discovered.effect';
import { NOTIFY_ON_HUB_KEYBOARD_CONNECTED_EFFECT } from './notify-on-keyboard-connected.effect';
import { NOTIFY_ON_GAMEPAD_CONNECTED_EFFECT } from './notify-on-gamepad-connected.effect';
import { NOTIFY_ON_GAMEPAD_DISCOVERED_EFFECT } from './notify-on-gamepad-discovered.effect';

export const CONTROLLER_LISTEN_CONNECT_EFFECTS: {[name: string]: FunctionalEffect} = {
    gamepadConnect: LISTEN_GAMEPAD_CONNECT,
    keyboardConnect: LISTEN_KEYBOARD_CONNECT,
    hubConnect: LISTEN_HUB_CONNECT,
    notifyOnHubKeyboardDiscovered: NOTIFY_ON_HUB_KEYBOARD_DISCOVERED_EFFECT,
    notifyOnHubKeyboardConnected: NOTIFY_ON_HUB_KEYBOARD_CONNECTED_EFFECT,
    notifyOnGamepadDiscovered: NOTIFY_ON_GAMEPAD_DISCOVERED_EFFECT,
    notifyOnGamepadConnected: NOTIFY_ON_GAMEPAD_CONNECTED_EFFECT,
} as const;
