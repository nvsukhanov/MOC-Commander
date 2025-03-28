import { RouterState } from '@ngrx/router-store';

import {
  AttacheIoPropsState,
  AttachedIOState,
  AttachedIoModesState,
  AttachedIoPortModeInfoState,
  BluetoothAvailabilityState,
  ControlSchemeWidgetsDataState,
  ControllerConnectionState,
  ControllerSettingsState,
  ControllersState,
  HubEditFormActiveSavesState,
  HubRuntimeDataState,
  IControlSchemeState,
  IControllerInputState,
  IHubsState,
  PortTasksState,
  SettingsState,
} from './reducers';
import { AppStoreVersion } from './app-store-version';

export interface IState {
  bluetoothAvailability: BluetoothAvailabilityState;
  controllers: ControllersState;
  controllerInput: IControllerInputState;
  controllerSettings: ControllerSettingsState;
  controllerConnections: ControllerConnectionState;
  controlSchemes: IControlSchemeState;
  controlSchemeWidgetsData: ControlSchemeWidgetsDataState;
  hubs: IHubsState;
  hubRuntimeData: HubRuntimeDataState;
  attachedIos: AttachedIOState;
  attachedIoProps: AttacheIoPropsState;
  attachedIoModes: AttachedIoModesState;
  attachedIoPortModeInfo: AttachedIoPortModeInfoState;
  hubEditFormActiveSaves: HubEditFormActiveSavesState;
  portTasks: PortTasksState;
  router: RouterState;
  settings: SettingsState;
  storeVersion: AppStoreVersion;
  appVersion: string;
}
