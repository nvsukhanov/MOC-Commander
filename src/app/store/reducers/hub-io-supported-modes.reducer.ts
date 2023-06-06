import { createReducer, on } from '@ngrx/store';

import { HUB_IO_SUPPORTED_MODES_ENTITY_ADAPTER } from '../entity-adapters';
import { HUB_IO_SUPPORTED_MODES } from '../actions';
import { IState } from '../i-state';

export const HUB_IO_OUTPUT_MODES_REDUCER = createReducer(
    HUB_IO_SUPPORTED_MODES_ENTITY_ADAPTER.getInitialState(),
    on(HUB_IO_SUPPORTED_MODES.portModesReceived, (state, data): IState['hubIOSupportedModes'] => HUB_IO_SUPPORTED_MODES_ENTITY_ADAPTER.addOne({
        hardwareRevision: data.hardwareRevision,
        softwareRevision: data.softwareRevision,
        ioType: data.ioType,
        portInputModes: data.portInputModes,
        portOutputModes: data.portOutputModes,
    }, state))
);
