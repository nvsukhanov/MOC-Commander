import { ControllerConnectionState, ControllerType, HubConnectionState, IState } from './i-state';

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
    },
    bluetoothAvailability: {
        isAvailable: false
    }
};
