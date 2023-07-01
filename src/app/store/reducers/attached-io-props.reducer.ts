import { EntityAdapter, EntityState, createEntityAdapter } from '@ngrx/entity';
import { createFeature, createReducer, on } from '@ngrx/store';

import { AttachedIoPropsModel } from '../models';
import { ATTACHED_IOS_ACTIONS, ATTACHED_IO_PROPS_ACTIONS, HUBS_ACTIONS } from '../actions';
import { attachedIosIdFn } from './attached-ios.reducer';

export type AttacheIoPropsState = EntityState<AttachedIoPropsModel>;

export const ATTACHED_IO_PROPS_ENTITY_ADAPTER: EntityAdapter<AttachedIoPropsModel> = createEntityAdapter<AttachedIoPropsModel>({
    selectId: (io) => hubAttachedIoPropsIdFn(io),
});

export function hubAttachedIoPropsIdFn(
    { hubId, portId }: { hubId: string, portId: number }
): string {
    return `${hubId}/${portId}`;
}

export const ATTACHED_IO_PROPS_INITIAL_STATE = ATTACHED_IO_PROPS_ENTITY_ADAPTER.getInitialState();

export const ATTACHED_IO_PROPS_FEATURE = createFeature({
    name: 'attachedIoProps',
    reducer: createReducer(
        ATTACHED_IO_PROPS_INITIAL_STATE,
        on(ATTACHED_IOS_ACTIONS.ioDisconnected, (state, data): AttacheIoPropsState => ATTACHED_IO_PROPS_ENTITY_ADAPTER.removeOne(
            attachedIosIdFn(data),
            state
        )),
        on(ATTACHED_IO_PROPS_ACTIONS.motorEncoderOffsetReceived, (state, data): AttacheIoPropsState =>
            ATTACHED_IO_PROPS_ENTITY_ADAPTER.upsertOne({
                    hubId: data.hubId,
                    portId: data.portId,
                    motorEncoderOffset: data.offset,
                },
                state
            )),
        on(HUBS_ACTIONS.forgetHub, (state, { hubId }): AttacheIoPropsState =>
            ATTACHED_IO_PROPS_ENTITY_ADAPTER.removeMany((io) => io.hubId === hubId, state)
        ),
    )
});
