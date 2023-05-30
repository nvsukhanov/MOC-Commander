import { createReducer, on } from '@ngrx/store';
import { INITIAL_STATE } from '../initial-state';
import { HUB_ATTACHED_IOS_ACTIONS, HUB_ATTACHED_IOS_STATE_ACTIONS, HUBS_ACTIONS } from '../actions';
import { HUB_ATTACHED_IO_STATE_ENTITY_ADAPTER, hubAttachedIosIdFn } from '../entity-adapters';

export const HUB_ATTACHED_IO_STATE_REDUCERS = createReducer(
    INITIAL_STATE.hubAttachedIOState,
    on(HUB_ATTACHED_IOS_ACTIONS.unregisterIO, (state, data) => HUB_ATTACHED_IO_STATE_ENTITY_ADAPTER.removeOne(
        hubAttachedIosIdFn(data),
        state
    )),
    on(HUB_ATTACHED_IOS_STATE_ACTIONS.motorEncoderOffsetReceived, (state, data) => HUB_ATTACHED_IO_STATE_ENTITY_ADAPTER.upsertOne(
        {
            hubId: data.hubId,
            portId: data.portId,
            motorEncoderOffset: data.offset,
        },
        state
    )),
    on(HUBS_ACTIONS.forgetHub, (state, { hubId }) => HUB_ATTACHED_IO_STATE_ENTITY_ADAPTER.removeMany((io) => io.hubId === hubId, state)),
);
