import { RouterState } from '@ngrx/router-store';

import {
    AttacheIoPropsState,
    AttachedIOState,
    AttachedIoModesState,
    AttachedIoPortModeInfoState,
    BluetoothAvailabilityState,
    ControlSchemeState,
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
    controlSchemes: ControlSchemeState;
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


