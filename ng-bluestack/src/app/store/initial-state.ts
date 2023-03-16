import { ControllerConnectionState, HubConnectionState, IState } from './i-state';
import { ControllerType } from '../types';

export const INITIAL_STATE: IState = {
    controller: {
        controllerType: ControllerType.Unassigned,
        connectionState: ControllerConnectionState.NotConnected,
        gamepadConfig: {
            index: null,
            id: '',
            nameL10nKey: null,
            axes: [],
            buttons: []
        },
        controllerState: {
            axes: {},
            buttons: {}
        }
    },
    hub: {
        connectionState: HubConnectionState.NotConnected
    }
};
