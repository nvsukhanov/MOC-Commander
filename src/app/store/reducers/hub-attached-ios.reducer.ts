import { createReducer, on } from '@ngrx/store';

import { HUB_ATTACHED_IOS_ENTITY_ADAPTER, hubAttachedIosIdFn } from '../entity-adapters';
import { HUBS_ACTIONS, HUB_ATTACHED_IOS_ACTIONS } from '../actions';
import { INITIAL_STATE } from '../initial-state';
import { IState } from '../i-state';

export const HUB_ATTACHED_IOS_REDUCER = createReducer(
    INITIAL_STATE.hubAttachedIOs,
    on(HUB_ATTACHED_IOS_ACTIONS.ioConnected, (state, { io }): IState['hubAttachedIOs'] => {
        return HUB_ATTACHED_IOS_ENTITY_ADAPTER.addOne({
            hubId: io.hubId,
            portId: io.portId,
            ioType: io.ioType,
            hardwareRevision: io.hardwareRevision,
            softwareRevision: io.softwareRevision,
        }, state);
    }),
    on(HUB_ATTACHED_IOS_ACTIONS.ioDisconnected, (state, data): IState['hubAttachedIOs'] => HUB_ATTACHED_IOS_ENTITY_ADAPTER.removeOne(
        hubAttachedIosIdFn(data),
        state
    )),
    on(HUBS_ACTIONS.connected, (state, data): IState['hubAttachedIOs'] => HUB_ATTACHED_IOS_ENTITY_ADAPTER.removeMany(
        (d) => d.hubId === data.hubId,
        state
    ))
);
