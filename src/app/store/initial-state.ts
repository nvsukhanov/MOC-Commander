import { RouterState } from '@ngrx/router-store';

import { IState } from './i-state';
import {
    HUB_ATTACHED_IOS_ENTITY_ADAPTER,
    HUB_ATTACHED_IO_STATE_ENTITY_ADAPTER,
    HUB_IO_SUPPORTED_MODES_ENTITY_ADAPTER,
    HUB_PORT_MODE_INFO,
    HUB_STATS_ENTITY_ADAPTER,
    LAST_EXECUTED_TASKS_ENTITY_ADAPTER
} from './entity-adapters';
import { CONTROLLERS_INITIAL_STATE } from './controllers';
import { BLUETOOTH_AVAILABILITY_INITIAL_STATE } from './bluetooth-availability';
import { CONTROLLER_INPUT_INITIAL_STATE } from './controller-input';
import { CONTROLLER_SETTINGS_INITIAL_STATE } from './controller-settings';
import { CONTROL_SCHEMES_INITIAL_STATE } from './control-schemes';
import { HUBS_INITIAL_STATE } from './hubs';

export const INITIAL_STATE: IState = {
    bluetoothAvailability: BLUETOOTH_AVAILABILITY_INITIAL_STATE,
    controllers: CONTROLLERS_INITIAL_STATE,
    controllerInput: CONTROLLER_INPUT_INITIAL_STATE,
    controllerSettings: CONTROLLER_SETTINGS_INITIAL_STATE,
    controlSchemes: CONTROL_SCHEMES_INITIAL_STATE,
    hubs: HUBS_INITIAL_STATE,
    hubStats: HUB_STATS_ENTITY_ADAPTER.getInitialState(),
    hubAttachedIos: HUB_ATTACHED_IOS_ENTITY_ADAPTER.getInitialState(),
    hubAttachedIoProps: HUB_ATTACHED_IO_STATE_ENTITY_ADAPTER.getInitialState(),
    hubIoSupportedModes: HUB_IO_SUPPORTED_MODES_ENTITY_ADAPTER.getInitialState(),
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
    router: RouterState.Full,
};
