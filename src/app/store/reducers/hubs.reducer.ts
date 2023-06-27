import { createReducer, on } from '@ngrx/store';
import { HubType } from '@nvsukhanov/rxpoweredup';

import { HUBS_ENTITY_ADAPTER } from '../entity-adapters';
import { HUBS_ACTIONS } from '../actions';
import { IState } from '../i-state';
import { INITIAL_STATE } from '../initial-state';

export const HUBS_REDUCER = createReducer(
    INITIAL_STATE.hubs,
    on(HUBS_ACTIONS.connected,
        (state, data): IState['hubs'] => HUBS_ENTITY_ADAPTER.upsertOne({
            hubId: data.hubId,
            name: data.name,
            hubType: HubType.Unknown,
        }, state)
    ),
    on(HUBS_ACTIONS.hubTypeReceived, (state, data): IState['hubs'] => HUBS_ENTITY_ADAPTER.updateOne({
            id: data.hubId,
            changes: {
                hubType: data.hubType,
            }
        },
        state
    )),

    on(HUBS_ACTIONS.hubNameSet, (state, data): IState['hubs'] => HUBS_ENTITY_ADAPTER.updateOne({
            id: data.hubId,
            changes: {
                name: data.name,
            }
        }, state
    )),
    on(HUBS_ACTIONS.forgetHub, (state, { hubId }): IState['hubs'] => HUBS_ENTITY_ADAPTER.removeOne(hubId, state)),
);
