import { createFeature, createReducer, on } from '@ngrx/store';
import { HubType } from '@nvsukhanov/rxpoweredup';
import { EntityAdapter, EntityState, createEntityAdapter } from '@ngrx/entity';

import { HubDiscoveryState, HubModel } from '../models';
import { HUBS_ACTIONS } from '../actions';

export interface HubsState extends EntityState<HubModel> {
    discoveryState: HubDiscoveryState;
}

export const HUBS_ENTITY_ADAPTER: EntityAdapter<HubModel> = createEntityAdapter<HubModel>({
    selectId: (hub) => hub.hubId,
    sortComparer: (a, b) => a.hubId.localeCompare(b.hubId)
});

export const HUBS_INITIAL_STATE = HUBS_ENTITY_ADAPTER.getInitialState({
    discoveryState: HubDiscoveryState.Idle
});

export const HUBS_FEATURE = createFeature({
    name: 'hubs',
    reducer: createReducer(
        HUBS_INITIAL_STATE,
        on(HUBS_ACTIONS.connected, (state, action): HubsState => {
            return HUBS_ENTITY_ADAPTER.upsertOne({ hubId: action.hubId, name: action.name, hubType: HubType.Unknown }, state);
        }),
        on(HUBS_ACTIONS.hubTypeReceived, (state, data): HubsState => {
            return HUBS_ENTITY_ADAPTER.updateOne({ id: data.hubId, changes: { hubType: data.hubType } }, state);
        }),
        on(HUBS_ACTIONS.hubNameSet, (state, data): HubsState => {
            return HUBS_ENTITY_ADAPTER.updateOne({ id: data.hubId, changes: { name: data.name } }, state);
        }),
        on(HUBS_ACTIONS.forgetHub, (state, { hubId }): HubsState => HUBS_ENTITY_ADAPTER.removeOne(hubId, state)),
        on(HUBS_ACTIONS.startDiscovery,
            (state): HubsState => ({ ...state, discoveryState: HubDiscoveryState.Discovering })
        ),
        on(HUBS_ACTIONS.connected,
            HUBS_ACTIONS.deviceConnectFailed,
            (state): HubsState => ({
                ...state,
                discoveryState: HubDiscoveryState.Idle
            })
        ),
    )
});
