import { createFeature, createReducer, on } from '@ngrx/store';
import { HubType } from 'rxpoweredup';
import { EntityAdapter, EntityState, createEntityAdapter } from '@ngrx/entity';

import { HubDiscoveryState, HubModel } from '../models';
import { HUBS_ACTIONS } from '../actions';

export interface IHubsState extends EntityState<HubModel> {
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
        on(HUBS_ACTIONS.connected, (state, action): IHubsState => {
            return HUBS_ENTITY_ADAPTER.upsertOne({ hubId: action.hubId, name: action.name, hubType: HubType.Unknown }, state);
        }),
        on(HUBS_ACTIONS.hubTypeReceived, (state, data): IHubsState => {
            return HUBS_ENTITY_ADAPTER.updateOne({ id: data.hubId, changes: { hubType: data.hubType } }, state);
        }),
        on(HUBS_ACTIONS.hubNameSet, (state, data): IHubsState => {
            return HUBS_ENTITY_ADAPTER.updateOne({ id: data.hubId, changes: { name: data.name } }, state);
        }),
        on(HUBS_ACTIONS.forgetHub, (state, { hubId }): IHubsState => HUBS_ENTITY_ADAPTER.removeOne(hubId, state)),
        on(HUBS_ACTIONS.startDiscovery,
            (state): IHubsState => ({ ...state, discoveryState: HubDiscoveryState.Discovering })
        ),
        on(HUBS_ACTIONS.connected,
            HUBS_ACTIONS.deviceConnectFailed,
            HUBS_ACTIONS.discoveryCancelled,
            HUBS_ACTIONS.alreadyConnected,
            (state): IHubsState => ({
                ...state,
                discoveryState: HubDiscoveryState.Idle
            })
        )
    )
});
