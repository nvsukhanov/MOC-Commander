import { createFeature, createReducer, on } from '@ngrx/store';
import { EntityAdapter, EntityState, createEntityAdapter } from '@ngrx/entity';

import { HUBS_ACTIONS } from '../hubs';
import { HubStatsModel } from './hub-stats.model';
import { HUB_STATS_ACTIONS } from './hub-stats.actions';

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
            )),
        on(HUB_STATS_ACTIONS.batteryLevelReceived,
            (state, data): HubStatsState => HUB_STATS_ENTITY_ADAPTER.updateOne({
                    id: data.hubId,
                    changes: {
                        batteryLevel: data.batteryLevel,
                    }
                }, state
            )),
        on(HUB_STATS_ACTIONS.rssiLevelReceived,
            (state, { hubId, rssi }): HubStatsState => HUB_STATS_ENTITY_ADAPTER.updateOne({
                    id: hubId,
                    changes: {
                        rssi
                    }
                }, state
            )),
        on(HUB_STATS_ACTIONS.buttonStateReceived,
            (state, { hubId, isButtonPressed }): HubStatsState => HUB_STATS_ENTITY_ADAPTER.updateOne({
                    id: hubId,
                    changes: {
                        isButtonPressed
                    }
                }, state
            ))
    )
});
