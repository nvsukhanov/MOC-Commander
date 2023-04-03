import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { LpuConnectionError } from '../../lego-hub/errors';
import { IOType } from '../../lego-hub';
import { AttachedIOModesInformation } from '../i-state';

export const ACTIONS_CONFIGURE_HUB = createActionGroup({
    source: 'ACTIONS_CONFIGURE_HUB',
    events: {
        'start discovery': emptyProps(),
        'connecting': emptyProps(),
        'connected': emptyProps(),
        'disconnecting': emptyProps(),
        'disconnected': emptyProps(),
        'device connect failed': props<{ error: LpuConnectionError }>(),
        'user requested hub disconnection': emptyProps(),
        'battery level update': props<{ batteryLevel: null | number }>(),
        'rssi level update': props<{ rssiLevel: null | number }>(),
        'registerIO': props<{ portId: number, ioType: IOType }>(),
        'unregisterIO': props<{ portId: number }>(),
        'port value update': props<{ portId: number, value: number[] }>(),
        'port mode information update': props<{ portId: number, modesInformation: AttachedIOModesInformation }>(),
    }
});

export const ACTION_CONFIGURE_HUB_TERMINATION = [
    ACTIONS_CONFIGURE_HUB.disconnected,
    ACTIONS_CONFIGURE_HUB.deviceConnectFailed,
];
