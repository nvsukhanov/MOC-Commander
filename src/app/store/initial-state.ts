import { ControllerConnectionState, ControllerType, IState } from './i-state';
import {
    HUB_ATTACHED_IOS_ENTITY_ADAPTER,
    HUB_IO_DATA_ENTITY_ADAPTER,
    HUB_IO_OUTPUT_MODES_ENTITY_ADAPTER,
    HUB_PORT_MODE_INFO,
    HUBS_ENTITY_ADAPTER
} from './entity-adapters';
import { RouterState } from '@ngrx/router-store';

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
    hubs: HUBS_ENTITY_ADAPTER.getInitialState(),
    hubAttachedIOs: HUB_ATTACHED_IOS_ENTITY_ADAPTER.getInitialState(),
    hubIOOutputModes: HUB_IO_OUTPUT_MODES_ENTITY_ADAPTER.getInitialState(),
    hubIOdata: HUB_IO_DATA_ENTITY_ADAPTER.getInitialState(),
    hubPortModeInfo: HUB_PORT_MODE_INFO.getInitialState(),
    bluetoothAvailability: {
        isAvailable: false
    },
    router: RouterState.Full,
};
