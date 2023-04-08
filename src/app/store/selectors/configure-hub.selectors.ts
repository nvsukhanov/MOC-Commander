/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { HubConnectionState, IState } from '../i-state';
import { ATTACHED_ENTITY_SELECTORS } from '../entity-adapters';
import { PortModeName } from '../../lego-hub';
import { SELECT_BLUETOOTH_AVAILABILITY } from './bluetooth-availability.selectors';

export const SELECT_HUB_FEATURE = createFeatureSelector<IState['hub']>('hub');

export const SELECT_CONNECTED_HUBS = createSelector(
    SELECT_HUB_FEATURE,
    (state) => {
        const result: Array<{ name: string, id: number, batteryLevel: number | null, rssiLevel: number | null }> = [];
        if (state.connectionState === HubConnectionState.Connected) {
            result.push({
                name: state.name as string,
                id: 0,
                batteryLevel: state.batteryLevel,
                rssiLevel: state.rssiLevel
            });
        }
        return result;
    }
);

export const SELECT_CAN_ADD_HUB = createSelector(
    SELECT_HUB_FEATURE,
    SELECT_BLUETOOTH_AVAILABILITY,
    (state, isBluetoothAvailable) => {
        return state.connectionState === HubConnectionState.NotConnected && isBluetoothAvailable;
    }
);

const SELECT_ATTACHED_IOS_ENTITY = createSelector(
    SELECT_HUB_FEATURE,
    (state) => state.attachedIOs
);

export const SELECT_ATTACHED_IOS = createSelector(
    SELECT_ATTACHED_IOS_ENTITY,
    ATTACHED_ENTITY_SELECTORS.selectEntities
);

export const SELECT_PORT_CONFIG = (portId: number) => createSelector(
    SELECT_ATTACHED_IOS,
    (state) => state[portId]
);

export const SELECT_PORT_AVAILABLE_INPUT_MODE_MAP = (portId: number) => createSelector(
    SELECT_PORT_CONFIG(portId),
    (state) => {
        const result: { [s in PortModeName]?: number } = {};
        if (state) {
            for (const mode in state.availableInputModes) {
                result[state.availableInputModes[mode].name] = Number(mode);
            }
        }
        return result;
    }
);
