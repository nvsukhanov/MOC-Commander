import { createReducer, on } from '@ngrx/store';

import { HUB_IO_SUPPORTED_MODES_ENTITY_ADAPTER, hubIOSupportedModesIdFn } from '../entity-adapters';
import { HUB_IO_SUPPORTED_MODES } from '../actions';
import { IState } from '../i-state';
import { INITIAL_STATE } from '../initial-state';

export const HUB_IO_OUTPUT_MODES_REDUCER = createReducer(
    INITIAL_STATE.hubIOSupportedModes,
    on(HUB_IO_SUPPORTED_MODES.portModesReceived, (state, data): IState['hubIOSupportedModes'] => HUB_IO_SUPPORTED_MODES_ENTITY_ADAPTER.addOne({
        id: hubIOSupportedModesIdFn(data.io),
        portInputModes: data.portInputModes,
        portOutputModes: data.portOutputModes,
        synchronizable: data.synchronizable
    }, state))
);
