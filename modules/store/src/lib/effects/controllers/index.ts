import { FunctionalEffect } from '@ngrx/effects';

import { CONTROLLER_LISTEN_CONNECT_EFFECTS } from './listen-connect';
import { CONTROLLER_LISTEN_DISCONNECT_EFFECTS } from './listen-disconnect';
import { CONTROLLER_CAPTURE_INPUT_EFFECTS } from './capture-input';

export const CONTROLLER_EFFECTS: { [name: string]: FunctionalEffect } = {
    ...CONTROLLER_CAPTURE_INPUT_EFFECTS,
    ...CONTROLLER_LISTEN_CONNECT_EFFECTS,
    ...CONTROLLER_LISTEN_DISCONNECT_EFFECTS
} as const;
