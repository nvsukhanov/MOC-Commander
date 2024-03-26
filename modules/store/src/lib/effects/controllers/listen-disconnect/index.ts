import { LISTEN_GAMEPAD_DISCONNECT } from './listen-gamepad-disconnect.effect';
import { LISTEN_HUB_DISCONNECT } from './listen-hub-disconnect.effect';
import { NOTIFY_ON_GAMEPAD_DISCONNECTED_EFFECT } from './notify-on-gamepad-disconnected.effect';

export const CONTROLLER_LISTEN_DISCONNECT_EFFECTS = {
    gamepadDisconnect: LISTEN_GAMEPAD_DISCONNECT,
    hubDisconnect: LISTEN_HUB_DISCONNECT,
    notifyOnGamepadDisconnected: NOTIFY_ON_GAMEPAD_DISCONNECTED_EFFECT,
} as const;
