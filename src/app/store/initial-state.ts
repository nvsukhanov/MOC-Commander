import { IState } from './i-state';
import {
    CONTROL_SCHEMES_ENTITY_ADAPTER,
    GAMEPAD_AXES_STATES_ENTITY_ADAPTER,
    GAMEPAD_BUTTONS_STATES_ENTITY_ADAPTER,
    GAMEPADS_ENTITY_ADAPTER,
    HUB_ATTACHED_IOS_ENTITY_ADAPTER,
    HUB_IO_DATA_ENTITY_ADAPTER,
    HUB_IO_SUPPORTED_MODES_ENTITY_ADAPTER,
    HUB_PORT_MODE_INFO,
    HUBS_ENTITY_ADAPTER
} from './entity-adapters';
import { RouterState } from '@ngrx/router-store';

export const INITIAL_STATE: IState = {
    controlSchemes: CONTROL_SCHEMES_ENTITY_ADAPTER.getInitialState(),
    controlSchemeConfigurationState: {
        isListening: false
    },
    gamepads: GAMEPADS_ENTITY_ADAPTER.getInitialState(),
    gamepadAxesState: GAMEPAD_AXES_STATES_ENTITY_ADAPTER.getInitialState(),
    gamepadButtonsState: GAMEPAD_BUTTONS_STATES_ENTITY_ADAPTER.getInitialState(),
    hubs: HUBS_ENTITY_ADAPTER.getInitialState(),
    hubAttachedIOs: HUB_ATTACHED_IOS_ENTITY_ADAPTER.getInitialState(),
    hubIOSupportedModes: HUB_IO_SUPPORTED_MODES_ENTITY_ADAPTER.getInitialState(),
    hubIOdata: HUB_IO_DATA_ENTITY_ADAPTER.getInitialState(),
    hubPortModeInfo: HUB_PORT_MODE_INFO.getInitialState(),
    bluetoothAvailability: {
        isAvailable: false
    },
    router: RouterState.Full,
} as const;
