import { RouterState } from '@ngrx/router-store';

import { ControlSchemeRunStage, HubDiscoveryState, IState } from './i-state';
import {
    CONTROLLERS_ENTITY_ADAPTER,
    CONTROLLER_INPUT_ENTITY_ADAPTER,
    CONTROLLER_SETTINGS_ENTITY_ADAPTER,
    CONTROL_SCHEMES_ENTITY_ADAPTER,
    HUBS_ENTITY_ADAPTER,
    HUB_ATTACHED_IOS_ENTITY_ADAPTER,
    HUB_ATTACHED_IO_STATE_ENTITY_ADAPTER,
    HUB_CONNECTIONS_ENTITY_ADAPTER,
    HUB_IO_SUPPORTED_MODES_ENTITY_ADAPTER,
    HUB_PORT_MODE_INFO,
    HUB_VIRTUAL_PORT_ENTITY_ADAPTER,
    LAST_EXECUTED_TASKS_ENTITY_ADAPTER
} from './entity-adapters';

export const INITIAL_STATE: IState = {
    controllers: CONTROLLERS_ENTITY_ADAPTER.getInitialState(),
    controllerInput: CONTROLLER_INPUT_ENTITY_ADAPTER.getInitialState(),
    controllerInputCapture: {
        listenersCount: 0
    },
    controllerSettings: CONTROLLER_SETTINGS_ENTITY_ADAPTER.getInitialState(),
    controlSchemes: CONTROL_SCHEMES_ENTITY_ADAPTER.getInitialState(),
    controlSchemeConfigurationState: {
        isListening: false
    },
    controlSchemeRunningState: {
        stage: ControlSchemeRunStage.Idle,
        runningSchemeId: null
    },
    hubs: HUBS_ENTITY_ADAPTER.getInitialState(),
    hubConnections: HUB_CONNECTIONS_ENTITY_ADAPTER.getInitialState(),
    hubDiscoveryState: {
        discoveryState: HubDiscoveryState.Idle
    },
    hubAttachedIOs: HUB_ATTACHED_IOS_ENTITY_ADAPTER.getInitialState(),
    hubAttachedIOState: HUB_ATTACHED_IO_STATE_ENTITY_ADAPTER.getInitialState(),
    hubVirtualPorts: HUB_VIRTUAL_PORT_ENTITY_ADAPTER.getInitialState(),
    hubIOSupportedModes: HUB_IO_SUPPORTED_MODES_ENTITY_ADAPTER.getInitialState(),
    hubPortModeInfo: HUB_PORT_MODE_INFO.getInitialState(),
    hubPortTasks: {
        queue: [],
        totalTasksExecuted: 0,
        lastTaskExecutionTime: 0,
        maxQueueLength: 0,
        lastExecutedTasks: LAST_EXECUTED_TASKS_ENTITY_ADAPTER.getInitialState()
    },
    hubEditFormActiveSaves: {
        hubIds: []
    },
    servoCalibrationTaskState: {
        calibrationInProgress: false
    },
    bluetoothAvailability: {
        isAvailable: false
    },
    router: RouterState.Full,
};
