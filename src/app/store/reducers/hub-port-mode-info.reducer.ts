import { createReducer, on } from '@ngrx/store';

import { HUB_PORT_MODE_INFO } from '../entity-adapters';
import { HUB_PORT_MODE_INFO_ACTIONS } from '../actions';
import { IState } from '../i-state';
import { INITIAL_STATE } from '../initial-state';

export const HUB_PORT_MODE_INFO_REDUCER = createReducer(
    INITIAL_STATE.hubPortModeInfo,
    on(HUB_PORT_MODE_INFO_ACTIONS.addPortModeData, (state, data): IState['hubPortModeInfo'] => HUB_PORT_MODE_INFO.addMany(data.dataSets, state))
);
