import { createReducer, on } from '@ngrx/store';
import { INITIAL_STATE } from '../initial-state';
import { ACTIONS_CONFIGURE_HUB } from '../actions';
import { HubConnectionState } from '../i-state';
import { ATTACHED_IO_ENTITY_ADAPTER } from '../entity-adapters';

export const CONFIGURE_HUB_REDUCERS = createReducer(
    INITIAL_STATE['hub'],
    on(ACTIONS_CONFIGURE_HUB.connected, (state) => ({ ...state, connectionState: HubConnectionState.Connected })),
    on(ACTIONS_CONFIGURE_HUB.connecting, (state) => ({ ...state, connectionState: HubConnectionState.Connecting })),
    on(ACTIONS_CONFIGURE_HUB.userRequestedHubDisconnection, (state) => ({ ...state, connectionState: HubConnectionState.Disconnecting })),
    on(ACTIONS_CONFIGURE_HUB.disconnected, (state) => ({
        ...state,
        connectionState: HubConnectionState.NotConnected,
        batteryLevel: null,
        rssiLevel: null,
        name: null,
        attachedIOs: ATTACHED_IO_ENTITY_ADAPTER.getInitialState()
    })),
    on(ACTIONS_CONFIGURE_HUB.batteryLevelUpdate, (state, data) => ({ ...state, batteryLevel: data.batteryLevel })),
    on(ACTIONS_CONFIGURE_HUB.rssiLevelUpdate, (state, data) => ({ ...state, rssiLevel: data.rssiLevel })),
    on(ACTIONS_CONFIGURE_HUB.registerio, (state, data) => ({
        ...state,
        attachedIOs: ATTACHED_IO_ENTITY_ADAPTER.addOne({
            portId: data.portId,
            ioType: data.ioType,
            value: [],
            availableInputModes: {},
            availableOutputModes: {},
            currentInputPortMode: null,
        }, state.attachedIOs),
    })),
    on(ACTIONS_CONFIGURE_HUB.unregisterio, (state, data) => {
            return { ...state, attachedIOs: ATTACHED_IO_ENTITY_ADAPTER.removeOne(data.portId, state.attachedIOs) };
        }
    ),
    on(ACTIONS_CONFIGURE_HUB.portValueUpdate, (state, data) => ({
        ...state,
        attachedIOs: ATTACHED_IO_ENTITY_ADAPTER.updateOne({
                id: data.portId,
                changes: {
                    value: data.value
                }
            }, state.attachedIOs
        )
    })),
    on(ACTIONS_CONFIGURE_HUB.portModeInformationUpdate, (state, data) => ({
        ...state,
        attachedIOs: ATTACHED_IO_ENTITY_ADAPTER.updateOne({
                id: data.portId,
                changes: {
                    availableInputModes: data.inputModes,
                    availableOutputModes: data.outputModes,
                    currentInputPortMode: data.currentMode,
                }
            }, state.attachedIOs
        )
    })),
    on(ACTIONS_CONFIGURE_HUB.portModeSetCompleted, (state, data) => ({
        ...state,
        attachedIOs: ATTACHED_IO_ENTITY_ADAPTER.updateOne({
            id: data.portId,
            changes: {
                currentInputPortMode: data.mode,
                value: []
            }
        }, state.attachedIOs)
    })),
);
