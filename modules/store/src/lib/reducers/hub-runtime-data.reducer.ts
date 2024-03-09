import { createFeature, createReducer, on } from '@ngrx/store';
import { EntityAdapter, EntityState, createEntityAdapter } from '@ngrx/entity';

import { HUBS_ACTIONS, HUB_RUNTIME_DATA_ACTIONS } from '../actions';
import { HubRuntimeDataModel } from '../models';

export type HubRuntimeDataState = EntityState<HubRuntimeDataModel>;

export const HUB_RUNTIME_DATA_ENTITY_ADAPTER: EntityAdapter<HubRuntimeDataModel> = createEntityAdapter<HubRuntimeDataModel>({
    selectId: (runtimeData) => runtimeData.hubId,
});

export const HUB_RUNTIME_DATA_INITIAL_STATE: HubRuntimeDataState = HUB_RUNTIME_DATA_ENTITY_ADAPTER.getInitialState();

export const HUB_RUNTIME_DATA_FEATURE = createFeature({
    name: 'hubRuntimeData',
    reducer: createReducer(
        HUB_RUNTIME_DATA_INITIAL_STATE,
        on(HUBS_ACTIONS.connected, (state, { hubId }): HubRuntimeDataState =>
            HUB_RUNTIME_DATA_ENTITY_ADAPTER.addOne({
                hubId,
                rssi: null,
                isButtonPressed: false,
                batteryLevel: null,
                hasCommunication: false,
                valueRequestPortIds: [],
                hardwareVersion: null,
                firmwareVersion: null
            }, state)
        ),
        on(HUBS_ACTIONS.disconnected, (state, { hubId }): HubRuntimeDataState => HUB_RUNTIME_DATA_ENTITY_ADAPTER.removeOne(hubId, state)),
        on(HUB_RUNTIME_DATA_ACTIONS.setHasCommunication,
            (state, data): HubRuntimeDataState => HUB_RUNTIME_DATA_ENTITY_ADAPTER.updateOne({
                    id: data.hubId,
                    changes: {
                        hasCommunication: data.hasCommunication,
                    }
                }, state
            )
        ),
        on(HUB_RUNTIME_DATA_ACTIONS.batteryLevelReceived,
            (state, data): HubRuntimeDataState => HUB_RUNTIME_DATA_ENTITY_ADAPTER.updateOne({
                    id: data.hubId,
                    changes: {
                        batteryLevel: data.batteryLevel,
                    }
                }, state
            )
        ),
        on(HUB_RUNTIME_DATA_ACTIONS.rssiLevelReceived,
            (state, { hubId, rssi }): HubRuntimeDataState => HUB_RUNTIME_DATA_ENTITY_ADAPTER.updateOne({
                    id: hubId,
                    changes: {
                        rssi
                    }
                }, state
            )
        ),
        on(HUB_RUNTIME_DATA_ACTIONS.buttonStateReceived,
            (state, { hubId, isButtonPressed }): HubRuntimeDataState => HUB_RUNTIME_DATA_ENTITY_ADAPTER.updateOne({
                    id: hubId,
                    changes: {
                        isButtonPressed
                    }
                }, state
            )
        ),
        on(HUB_RUNTIME_DATA_ACTIONS.setHardwareVersion,
            (state, { hubId, hardwareVersion }): HubRuntimeDataState => HUB_RUNTIME_DATA_ENTITY_ADAPTER.updateOne({
                    id: hubId,
                    changes: {
                        hardwareVersion
                    }
                }, state
            )
        ),
        on(HUB_RUNTIME_DATA_ACTIONS.setFirmwareVersion,
            (state, { hubId, firmwareVersion }): HubRuntimeDataState => HUB_RUNTIME_DATA_ENTITY_ADAPTER.updateOne({
                    id: hubId,
                    changes: {
                        firmwareVersion
                    }
                }, state
            )
        ),
        on(HUBS_ACTIONS.requestPortPosition, HUBS_ACTIONS.requestPortAbsolutePosition,
            (state, { hubId, portId }): HubRuntimeDataState => {
                const currentlyRequestedPorts = state.entities[hubId]?.valueRequestPortIds || [];
                return HUB_RUNTIME_DATA_ENTITY_ADAPTER.updateOne({
                        id: hubId,
                        changes: {
                            valueRequestPortIds: [ ...currentlyRequestedPorts, portId ]
                        }
                    }, state
                );
            }
        ),
        on(
            HUBS_ACTIONS.portAbsolutePositionRead,
            HUBS_ACTIONS.portAbsolutePositionReadFailed,
            HUBS_ACTIONS.portPositionRead,
            HUBS_ACTIONS.portPositionReadFailed,
            (state, { hubId, portId }): HubRuntimeDataState => {
                const currentlyRequestedPorts = state.entities[hubId]?.valueRequestPortIds || [];
                return HUB_RUNTIME_DATA_ENTITY_ADAPTER.updateOne({
                        id: hubId,
                        changes: {
                            valueRequestPortIds: currentlyRequestedPorts.filter((id) => id !== portId)
                        }
                    }, state
                );
            }
        )
    )
});
