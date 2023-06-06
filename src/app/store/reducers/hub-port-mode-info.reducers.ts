import { createReducer, on } from '@ngrx/store';

import { HUB_PORT_MODE_INFO } from '../entity-adapters';
import { HUB_PORT_MODE_INFO_ACTIONS } from '../actions';

export const HUB_PORT_MODE_INFO_REDUCERS = createReducer(
    HUB_PORT_MODE_INFO.getInitialState(),
    on(HUB_PORT_MODE_INFO_ACTIONS.addPortModeData, (state, data) => HUB_PORT_MODE_INFO.addMany(data.dataSets, state))
);
