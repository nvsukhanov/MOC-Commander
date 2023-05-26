import { HUB_ATTACHED_IOS_ENTITY_ADAPTER, hubAttachedIosIdFn } from '../entity-adapters';
import { createReducer, on } from '@ngrx/store';
import { HUB_ATTACHED_IOS_ACTIONS, HUBS_ACTIONS } from '../actions';

export const HUB_ATTACHED_IOS_REDUCERS = createReducer(
    HUB_ATTACHED_IOS_ENTITY_ADAPTER.getInitialState(),
    on(HUB_ATTACHED_IOS_ACTIONS.registerIO, (state, data) => HUB_ATTACHED_IOS_ENTITY_ADAPTER.addOne({
            hubId: data.hubId,
            portId: data.portId,
            ioType: data.ioType,
            hardwareRevision: data.hardwareRevision,
            softwareRevision: data.softwareRevision,
            motorEncoderOffset: null
        },
        state
    )),
    on(HUB_ATTACHED_IOS_ACTIONS.unregisterIO, (state, data) => HUB_ATTACHED_IOS_ENTITY_ADAPTER.removeOne(
        hubAttachedIosIdFn(data.hubId, data.portId),
        state
    )),
    on(HUBS_ACTIONS.disconnected, (state, data) => HUB_ATTACHED_IOS_ENTITY_ADAPTER.removeMany(
        (d) => d.hubId === data.hubId,
        state
    )),
    on(HUB_ATTACHED_IOS_ACTIONS.motorEncoderOffsetReceived, (state, data) => HUB_ATTACHED_IOS_ENTITY_ADAPTER.updateOne({
            id: hubAttachedIosIdFn(data.hubId, data.portId),
            changes: {
                motorEncoderOffset: data.offset,
            }
        },
        state
    )),
);
