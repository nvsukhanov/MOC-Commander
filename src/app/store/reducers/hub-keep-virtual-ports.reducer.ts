import { createReducer, on } from '@ngrx/store';

import { INITIAL_STATE } from '../initial-state';
import { HUB_ATTACHED_IOS_ACTIONS } from '../actions';
import { IState } from '../i-state';
import { HUB_KEEP_VIRTUAL_PORTS_ENTITY_ADAPTER, hubKeepVirtualPortsIdFn } from '../entity-adapters';

export const HUB_KEEP_VIRTUAL_PORTS_REDUCER = createReducer(
    INITIAL_STATE['hubKeepVirtualPorts'],
    on(HUB_ATTACHED_IOS_ACTIONS.createVirtualPort, (state, data): IState['hubKeepVirtualPorts'] => {
        return HUB_KEEP_VIRTUAL_PORTS_ENTITY_ADAPTER.upsertOne({
            hubId: data.hubId,
            portIdA: data.portIdA,
            portIdB: data.portIdB,
        }, state);
    }),
    on(HUB_ATTACHED_IOS_ACTIONS.deleteVirtualPort, (state, io): IState['hubKeepVirtualPorts'] => {
        return HUB_KEEP_VIRTUAL_PORTS_ENTITY_ADAPTER.removeOne(hubKeepVirtualPortsIdFn({
            hubId: io.hubId,
            portIdA: io.portIdA,
            portIdB: io.portIdB,
        }), state);
    })
);
