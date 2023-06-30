import { HubType, IOType, MotorServoEndState, PortModeName, PortModeSymbol } from '@nvsukhanov/rxpoweredup';
import { EntityState } from '@ngrx/entity';
import { RouterState } from '@ngrx/router-store';

import { PortCommandTask } from '@app/shared';
import { HubIoOperationMode } from './hub-io-operation-mode';
import { ControllerInputType } from './controller-input-type';
import { ControllersState } from './controllers';
import { BluetoothAvailabilityState } from './bluetooth-availability';

export interface IState {
    bluetoothAvailability: BluetoothAvailabilityState,
    controllers: ControllersState;
    controllerInput: EntityState<ControllerInput>;
    controllerInputCapture: {
        listenersCount: number;
    },
    controllerSettings: EntityState<ControllerSettings>;
    controlSchemes: EntityState<ControlScheme>;
    controlSchemeConfigurationState: {
        isListening: boolean;
    };
    controlSchemeRunningState: {
        runningSchemeId: string | null;
    };
    hubs: EntityState<HubConfiguration>,
    hubStats: EntityState<HubStats>,
    hubDiscoveryState: {
        discoveryState: HubDiscoveryState;
    },
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

export type ControllerInput = {
    controllerId: string;
    inputType: ControllerInputType;
    inputId: string;
    value: number;
}

export type KeyboardSettings = {
    controllerId: string;
    captureNonAlphaNumerics: boolean;
}

export type GamepadSettings = {
    controllerId: string;
}

export type ControllerSettings = KeyboardSettings | GamepadSettings;

export type AttachedIoProps = {
    hubId: string;
    portId: number;
    motorEncoderOffset: number | null;
}

export enum HubDiscoveryState {
    Idle = 'Idle',
    Discovering = 'Discovering',
}

export type BindingLinearOutputState = {
    hubId: string;
    portId: number;
    operationMode: HubIoOperationMode.Linear;
    linearConfig: {
        maxSpeed: number;
        isToggle: boolean;
        invert: boolean;
        power: number;
    }
}

export type BindingServoOutputState = {
    hubId: string;
    portId: number;
    operationMode: HubIoOperationMode.Servo;
    servoConfig: {
        range: number;
        aposCenter: number;
        speed: number;
        power: number;
        invert: boolean;
    }
}

export type BindingSetAngleOutputState = {
    hubId: string;
    portId: number;
    operationMode: HubIoOperationMode.SetAngle;
    setAngleConfig: {
        angle: number;
        speed: number;
        power: number;
        endState: MotorServoEndState;
    }
}

export type BindingOutputState = BindingLinearOutputState | BindingServoOutputState | BindingSetAngleOutputState;

export type ControlSchemeBinding = {
    id: string;
    input: {
        controllerId: string;
        inputType: ControllerInputType;
        inputId: string;
    }
    output: BindingOutputState;
}

export type ControlScheme = {
    id: string;
    index: number;
    name: string;
    bindings: ControlSchemeBinding[];
}

export type HubIoSupportedModes = {
    id: string;
    portInputModes: number[];
    portOutputModes: number[];
    synchronizable: boolean;
}

export type HubConfiguration = {
    hubId: string;
    name: string;
    hubType: HubType;
}

export type HubStats = {
    hubId: string;
    RSSI: number | null;
    isButtonPressed: boolean;
    batteryLevel: number | null;
    hasCommunication: boolean;
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
