import { createFeature, createReducer, on } from '@ngrx/store';
import { EntityAdapter, EntityState, createEntityAdapter } from '@ngrx/entity';

import { HUBS_ACTIONS, HUB_STATS_ACTIONS } from '../actions';
import { HubStatsModel } from '../models';

export type HubStatsState = EntityState<HubStatsModel>;

export const HUB_STATS_ENTITY_ADAPTER: EntityAdapter<HubStatsModel> = createEntityAdapter<HubStatsModel>({
    selectId: (stats) => stats.hubId,
});

export const HUB_STATS_INITIAL_STATE: HubStatsState = HUB_STATS_ENTITY_ADAPTER.getInitialState();

export const HUB_STATS_FEATURE = createFeature({
    name: 'hubStats',
    reducer: createReducer(
        HUB_STATS_INITIAL_STATE,
        on(HUBS_ACTIONS.connected, (state, { hubId }): HubStatsState =>
            HUB_STATS_ENTITY_ADAPTER.addOne({
                hubId,
                rssi: null,
                isButtonPressed: false,
                batteryLevel: null,
                hasCommunication: false,
                valueRequestPortIds: []
            }, state)
        ),
        on(HUBS_ACTIONS.disconnected, (state, { hubId }): HubStatsState => HUB_STATS_ENTITY_ADAPTER.removeOne(hubId, state)),
        on(HUB_STATS_ACTIONS.setHasCommunication,
            (state, data): HubStatsState => HUB_STATS_ENTITY_ADAPTER.updateOne({
                    id: data.hubId,
                    changes: {
                        hasCommunication: data.hasCommunication,
                    }
                }, state
            )
        ),
        on(HUB_STATS_ACTIONS.batteryLevelReceived,
            (state, data): HubStatsState => HUB_STATS_ENTITY_ADAPTER.updateOne({
                    id: data.hubId,
                    changes: {
                        batteryLevel: data.batteryLevel,
                    }
                }, state
            )
        ),
        on(HUB_STATS_ACTIONS.rssiLevelReceived,
            (state, { hubId, rssi }): HubStatsState => HUB_STATS_ENTITY_ADAPTER.updateOne({
                    id: hubId,
                    changes: {
                        rssi
                    }
                }, state
            )
        ),
        on(HUB_STATS_ACTIONS.buttonStateReceived,
            (state, { hubId, isButtonPressed }): HubStatsState => HUB_STATS_ENTITY_ADAPTER.updateOne({
                    id: hubId,
                    changes: {
                        isButtonPressed
                    }
                }, state
            )
        ),
        on(HUBS_ACTIONS.requestPortPosition, HUBS_ACTIONS.requestPortAbsolutePosition,
            (state, { hubId, portId }): HubStatsState => {
                const currentlyRequestedPorts = state.entities[hubId]?.valueRequestPortIds || [];
                return HUB_STATS_ENTITY_ADAPTER.updateOne({
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
            (state, { hubId, portId }): HubStatsState => {
                const currentlyRequestedPorts = state.entities[hubId]?.valueRequestPortIds || [];
                return HUB_STATS_ENTITY_ADAPTER.updateOne({
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
