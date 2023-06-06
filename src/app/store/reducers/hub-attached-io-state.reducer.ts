import { createReducer, on } from '@ngrx/store';

import { INITIAL_STATE } from '../initial-state';
import { HUBS_ACTIONS, HUB_ATTACHED_IOS_ACTIONS, HUB_ATTACHED_IOS_STATE_ACTIONS } from '../actions';
import { HUB_ATTACHED_IO_STATE_ENTITY_ADAPTER, hubAttachedIosIdFn } from '../entity-adapters';
import { IState } from '../i-state';

export const HUB_ATTACHED_IO_STATE_REDUCER = createReducer(
    INITIAL_STATE.hubAttachedIOState,
    on(HUB_ATTACHED_IOS_ACTIONS.unregisterIO, (state, data): IState['hubAttachedIOState'] => HUB_ATTACHED_IO_STATE_ENTITY_ADAPTER.removeOne(
        hubAttachedIosIdFn(data),
        state
    )),
    on(HUB_ATTACHED_IOS_STATE_ACTIONS.motorEncoderOffsetReceived, (state, data): IState['hubAttachedIOState'] =>
        HUB_ATTACHED_IO_STATE_ENTITY_ADAPTER.upsertOne({
                hubId: data.hubId,
                portId: data.portId,
                motorEncoderOffset: data.offset,
            },
            state
        )),
    on(HUBS_ACTIONS.forgetHub, (state, { hubId }): IState['hubAttachedIOState'] =>
        HUB_ATTACHED_IO_STATE_ENTITY_ADAPTER.removeMany((io) => io.hubId === hubId, state)
    ),
);