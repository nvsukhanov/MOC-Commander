import { createReducer } from '@ngrx/store';

import { INITIAL_STATE } from '../initial-state';

export const HUB_VIRTUAL_PORT_REDUCER = createReducer(
    INITIAL_STATE['hubVirtualPorts']
);
