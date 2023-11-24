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
    { hubId, portId }: { hubId: string; portId: number }
): string {
    return `${hubId}/${portId}`;
}

export const ATTACHED_IO_PROPS_FEATURE = createFeature({
    name: 'attachedIoProps',
    reducer: createReducer(
        ATTACHED_IO_PROPS_ENTITY_ADAPTER.getInitialState(),
        on(ATTACHED_IOS_ACTIONS.ioDisconnected, (state, data): AttacheIoPropsState => ATTACHED_IO_PROPS_ENTITY_ADAPTER.removeOne(
            attachedIosIdFn(data),
            state
        )),
        on(ATTACHED_IO_PROPS_ACTIONS.motorEncoderOffsetReceived, (state, data): AttacheIoPropsState =>
            ATTACHED_IO_PROPS_ENTITY_ADAPTER.upsertOne({
                    hubId: data.hubId,
                    portId: data.portId,
                    motorEncoderOffset: data.offset,
                    startupServoCalibrationData: state.entities[hubAttachedIoPropsIdFn(data)]?.startupServoCalibrationData ?? null,
                    runtimeTiltCompensation: state.entities[hubAttachedIoPropsIdFn(data)]?.runtimeTiltCompensation ?? null,
                },
                state
            )
        ),
        on(ATTACHED_IO_PROPS_ACTIONS.startupServoCalibrationDataReceived, (state, data): AttacheIoPropsState =>
            ATTACHED_IO_PROPS_ENTITY_ADAPTER.upsertOne({
                    hubId: data.hubId,
                    portId: data.portId,
                    motorEncoderOffset: state.entities[hubAttachedIoPropsIdFn(data)]?.motorEncoderOffset ?? 0,
                    startupServoCalibrationData: {
                        aposCenter: data.aposCenter,
                        range: data.range,
                    },
                    runtimeTiltCompensation: state.entities[hubAttachedIoPropsIdFn(data)]?.runtimeTiltCompensation ?? null,
                },
                state
            )
        ),
        on(ATTACHED_IO_PROPS_ACTIONS.compensateTilt, (state, data): AttacheIoPropsState => {
            const initialCompensationData = state.entities[hubAttachedIoPropsIdFn(data)]?.runtimeTiltCompensation ?? { yaw: 0, pitch: 0, roll: 0 };
            return ATTACHED_IO_PROPS_ENTITY_ADAPTER.upsertOne({
                    hubId: data.hubId,
                    portId: data.portId,
                    motorEncoderOffset: state.entities[hubAttachedIoPropsIdFn(data)]?.motorEncoderOffset ?? 0,
                    startupServoCalibrationData: state.entities[hubAttachedIoPropsIdFn(data)]?.startupServoCalibrationData ?? null,
                    runtimeTiltCompensation: {
                        yaw: initialCompensationData.yaw + data.compensationData.yaw,
                        pitch: initialCompensationData.pitch + data.compensationData.pitch,
                        roll: initialCompensationData.roll + data.compensationData.roll,
                    },
                },
                state
            );
        }),
        on(ATTACHED_IO_PROPS_ACTIONS.resetTiltCompensation, (state, data): AttacheIoPropsState =>
            ATTACHED_IO_PROPS_ENTITY_ADAPTER.upsertOne({
                    hubId: data.hubId,
                    portId: data.portId,
                    motorEncoderOffset: state.entities[hubAttachedIoPropsIdFn(data)]?.motorEncoderOffset ?? 0,
                    startupServoCalibrationData: state.entities[hubAttachedIoPropsIdFn(data)]?.startupServoCalibrationData ?? null,
                    runtimeTiltCompensation: null,
                },
                state
            )),
        on(HUBS_ACTIONS.forgetHub, HUBS_ACTIONS.disconnected, (state, { hubId }): AttacheIoPropsState =>
            ATTACHED_IO_PROPS_ENTITY_ADAPTER.removeMany((io) => io.hubId === hubId, state)
        )
    )
});
