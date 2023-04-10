import { createReducer, on } from '@ngrx/store';
import { HUB_PORT_MODE_INFO } from '../entity-adapters';
import { HUB_PORT_MODE_INFO_ACTIONS } from '../actions/hub-port-mode-info.actions';

export const HUB_PORT_MODE_INFO_REDUCERS = createReducer(
    HUB_PORT_MODE_INFO.getInitialState(),
    on(HUB_PORT_MODE_INFO_ACTIONS.addPortModeData, (state, data) => HUB_PORT_MODE_INFO.addOne({
            hardwareRevision: data.hardwareRevision,
            softwareRevision: data.softwareRevision,
            modeId: data.modeId,
            ioType: data.ioType,
            name: data.name,
            symbol: data.symbol
        },
        state
    ))
);
