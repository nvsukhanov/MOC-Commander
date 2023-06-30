import { IOType, PortModeName, PortModeSymbol } from '@nvsukhanov/rxpoweredup';
import { EntityState } from '@ngrx/entity';
import { RouterState } from '@ngrx/router-store';

import { PortCommandTask } from '@app/shared';
import { ControllersState } from './controllers';
import { BluetoothAvailabilityState } from './bluetooth-availability';
import { ControllerInputState } from './controller-input';
import { ControllerSettingsState } from './controller-settings';
import { ControlSchemeState } from './control-schemes';
import { HubsState } from './hubs';
import { HubStatsState } from './hub-stats';

export interface IState {
    bluetoothAvailability: BluetoothAvailabilityState,
    controllers: ControllersState;
    controllerInput: ControllerInputState;
    controllerSettings: ControllerSettingsState;
    controlSchemes: ControlSchemeState;
    hubs: HubsState,
    hubStats: HubStatsState,
    hubAttachedIos: EntityState<AttachedIo>,
    hubAttachedIoProps: EntityState<AttachedIoProps>,
    hubIoSupportedModes: EntityState<HubIoSupportedModes>,
    hubPortModeInfo: EntityState<PortModeInfo>,
    hubPortTasks: {
        queue: PortCommandTask[],
        totalTasksExecuted: number,
        lastTaskExecutionTime: number,
        maxQueueLength: number,
        lastExecutedTasks: EntityState<PortCommandTask>
    },
    hubEditFormActiveSaves: {
        hubIds: string[]
    },
    servoCalibrationTaskState: {
        calibrationInProgress: boolean;
    },
    router: RouterState;
}

export type AttachedIoProps = {
    hubId: string;
    portId: number;
    motorEncoderOffset: number | null;
}

export type HubIoSupportedModes = {
    id: string;
    portInputModes: number[];
    portOutputModes: number[];
    synchronizable: boolean;
}

export type PortModeInfo = {
    id: string;
    modeId: number;
    name: PortModeName;
    symbol: PortModeSymbol;
}

export type AttachedIo = {
    hubId: string;
    portId: number;
    ioType: IOType;
    hardwareRevision: string;
    softwareRevision: string;
}
