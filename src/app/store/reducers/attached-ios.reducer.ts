import { createFeature, createReducer, on } from '@ngrx/store';
import { EntityState, createEntityAdapter } from '@ngrx/entity';

import { ATTACHED_IOS_ACTIONS, HUBS_ACTIONS } from '../actions';
import { AttachedIoModel } from '../models';

export type AttachedIOState = EntityState<AttachedIoModel>;

export const ATTACHED_IOS_ENTITY_ADAPTER = createEntityAdapter<AttachedIoModel>({
    selectId: (io) => attachedIosIdFn(io),
    sortComparer: (a, b) => a.portId - b.portId
});

export function attachedIosIdFn(
    { hubId, portId }: { hubId: string, portId: number }
): string {
    return `${hubId}/${portId}`;
}

export const ATTACHED_IOS_INITIAL_STATE = ATTACHED_IOS_ENTITY_ADAPTER.getInitialState();

export const ATTACHED_IOS_FEATURE = createFeature({
    name: 'attachedIos',
    reducer: createReducer(
        ATTACHED_IOS_INITIAL_STATE,
        on(ATTACHED_IOS_ACTIONS.ioConnected, (state, { io }): AttachedIOState => {
            return ATTACHED_IOS_ENTITY_ADAPTER.addOne({
                hubId: io.hubId,
                portId: io.portId,
                ioType: io.ioType,
                hardwareRevision: io.hardwareRevision,
                softwareRevision: io.softwareRevision,
            }, state);
        }),
        on(ATTACHED_IOS_ACTIONS.ioDisconnected, (state, data): AttachedIOState => ATTACHED_IOS_ENTITY_ADAPTER.removeOne(
            attachedIosIdFn(data),
            state
        )),
        on(HUBS_ACTIONS.connected, (state, data): AttachedIOState => ATTACHED_IOS_ENTITY_ADAPTER.removeMany(
            (d) => d.hubId === data.hubId,
            state
        ))
    )
});
