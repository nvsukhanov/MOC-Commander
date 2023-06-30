import { createReducer, on } from '@ngrx/store';

import { INITIAL_STATE } from '../initial-state';
import { HUB_STATS_ACTIONS } from '../actions';
import { IState } from '../i-state';
import { HUB_STATS_ENTITY_ADAPTER } from '../entity-adapters';
import { HUBS_ACTIONS } from '../hubs';

export const HUB_STATS_REDUCER = createReducer(
    INITIAL_STATE['hubStats'],
    on(HUBS_ACTIONS.connected, (state, { hubId }): IState['hubStats'] =>
        HUB_STATS_ENTITY_ADAPTER.addOne({
            hubId,
            RSSI: null,
            isButtonPressed: false,
            batteryLevel: null,
            hasCommunication: false,
        }, state)
    ),
    on(HUBS_ACTIONS.disconnected, (state, { hubId }): IState['hubStats'] =>
        HUB_STATS_ENTITY_ADAPTER.removeOne(hubId, state)
    ),
    on(HUB_STATS_ACTIONS.setHasCommunication, (state, data): IState['hubStats'] => HUB_STATS_ENTITY_ADAPTER.updateOne({
            id: data.hubId,
            changes: {
                hasCommunication: data.hasCommunication,
            }
        }, state
    )),
    on(HUB_STATS_ACTIONS.batteryLevelReceived, (state, data): IState['hubStats'] => HUB_STATS_ENTITY_ADAPTER.updateOne({
            id: data.hubId,
            changes: {
                batteryLevel: data.batteryLevel,
            }
        }, state
    )),
    on(HUB_STATS_ACTIONS.rssiLevelReceived, (state, data): IState['hubStats'] => HUB_STATS_ENTITY_ADAPTER.updateOne({
            id: data.hubId,
            changes: {
                RSSI: data.RSSI,
            }
        },
        state
    )),
    on(HUB_STATS_ACTIONS.buttonStateReceived, (state, data): IState['hubStats'] => HUB_STATS_ENTITY_ADAPTER.updateOne({
            id: data.hubId,
            changes: {
                isButtonPressed: data.isPressed,
            }
        },
        state
    )),
);
