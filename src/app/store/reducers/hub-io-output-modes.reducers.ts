import { createReducer, on } from '@ngrx/store';
import { HUB_IO_OUTPUT_MODES_ENTITY_ADAPTER } from '../entity-adapters';
import { HUB_IO_OUTPUT_MODES } from '../actions';

export const HUB_IO_OUTPUT_MODES_REDUCER = createReducer(
    HUB_IO_OUTPUT_MODES_ENTITY_ADAPTER.getInitialState(),
    on(HUB_IO_OUTPUT_MODES.portModesReceived, (state, data) => HUB_IO_OUTPUT_MODES_ENTITY_ADAPTER.addOne({
        hardwareRevision: data.hardwareRevision,
        softwareRevision: data.softwareRevision,
        ioType: data.ioType,
        outputModes: data.modes
    }, state))
);
