import { createReducer, on } from '@ngrx/store';
import { HUB_PORT_INPUT_MODES_BY_REVISION_ENTITY_ADAPTER } from '../entity-adapters';
import { HUB_PORT_INPUT_MODES_BY_REVISION_ACTIONS } from '../actions/hub-port-input-modes-by-revision.actions';

export const HUB_PORT_INPUT_MODES_BY_REVISION_REDUCERS = createReducer(
    HUB_PORT_INPUT_MODES_BY_REVISION_ENTITY_ADAPTER.getInitialState(),
    on(HUB_PORT_INPUT_MODES_BY_REVISION_ACTIONS.portModesReceived, (state, data) => HUB_PORT_INPUT_MODES_BY_REVISION_ENTITY_ADAPTER.addOne({
        hardwareRevision: data.hardwareRevision,
        softwareRevision: data.softwareRevision,
        ioType: data.ioType,
        inputModes: data.modes
    }, state))
);
