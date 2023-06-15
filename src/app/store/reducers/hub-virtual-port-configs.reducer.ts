import { createReducer, on } from '@ngrx/store';

import { INITIAL_STATE } from '../initial-state';
import { VIRTUAL_PORTS_ACTIONS } from '../actions';
import { HUB_VIRTUAL_PORT_CONFIGS_ENTITY_ADAPTER } from '../entity-adapters';

export const HUB_VIRTUAL_PORT_CONFIGS_REDUCER = createReducer(
    INITIAL_STATE['hubVirtualPortConfigs'],
    on(VIRTUAL_PORTS_ACTIONS.createVirtualPort, (state, action) => {
        return HUB_VIRTUAL_PORT_CONFIGS_ENTITY_ADAPTER.addOne({
            hubId: action.hubId,
            name: action.name,
            portIdA: action.portIdA,
            ioAType: action.ioAType,
            ioAHardwareRevision: action.ioAHardwareRevision,
            ioASoftwareRevision: action.ioASoftwareRevision,
            portIdB: action.portIdB,
            ioBType: action.ioBType,
            ioBHardwareRevision: action.ioBHardwareRevision,
            ioBSoftwareRevision: action.ioBSoftwareRevision
        }, state);
    }),
    on(VIRTUAL_PORTS_ACTIONS.deleteVirtualPort, (state, action) => {
        return HUB_VIRTUAL_PORT_CONFIGS_ENTITY_ADAPTER.removeOne(action.id, state);
    })
);
