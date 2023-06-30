import { createReducer, on } from '@ngrx/store';

import { HUB_IO_SUPPORTED_MODES_ENTITY_ADAPTER, hubIoSupportedModesIdFn } from '../entity-adapters';
import { HUB_IO_SUPPORTED_MODES } from '../actions';
import { IState } from '../i-state';
import { INITIAL_STATE } from '../initial-state';

export const HUB_IO_OUTPUT_MODES_REDUCER = createReducer(
    INITIAL_STATE.hubIoSupportedModes,
    on(HUB_IO_SUPPORTED_MODES.portModesReceived, (state, data): IState['hubIoSupportedModes'] => HUB_IO_SUPPORTED_MODES_ENTITY_ADAPTER.addOne({
        id: hubIoSupportedModesIdFn(data.io),
        portInputModes: data.portInputModes,
        portOutputModes: data.portOutputModes,
        synchronizable: data.synchronizable
    }, state))
);
