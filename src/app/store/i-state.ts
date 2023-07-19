import { RouterState } from '@ngrx/router-store';

import {
    AttacheIoPropsState,
    AttachedIOState,
    AttachedIoModesState,
    AttachedIoPortModeInfoState,
    BluetoothAvailabilityState,
    ControlSchemeState,
    ControlSchemeV2State,
    ControllerConnectionState,
    ControllerInputState,
    ControllerSettingsState,
    ControllersState,
    HubEditFormActiveSavesState,
    HubStatsState,
    HubsState,
    PortTasksState,
} from './reducers';

export interface IState {
    bluetoothAvailability: BluetoothAvailabilityState;
    controllers: ControllersState;
    controllerInput: ControllerInputState;
    controllerSettings: ControllerSettingsState;
    controllerConnections: ControllerConnectionState;
    controlSchemes: ControlSchemeState;
    controlSchemesV2: ControlSchemeV2State;
    hubs: HubsState;
    hubStats: HubStatsState;
    attachedIos: AttachedIOState;
    attachedIoProps: AttacheIoPropsState;
    attachedIoModes: AttachedIoModesState;
    attachedIoPortModeInfo: AttachedIoPortModeInfoState;
    hubEditFormActiveSaves: HubEditFormActiveSavesState;
    portTasks: PortTasksState;
    router: RouterState;
}


