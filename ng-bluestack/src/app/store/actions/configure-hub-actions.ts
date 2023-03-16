import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const ACTIONS_CONFIGURE_HUB = createActionGroup({
    source: 'ACTIONS_CONFIGURE_HUB',
    events: {
        'start discovery': emptyProps(),
        'device connected': props<{ device: BluetoothDevice }>(),
        'device connected gatt unavailable': props<{ device: BluetoothDevice }>(),
        'device disconnected': emptyProps(),
        'device connect failed': emptyProps(),
        'gatt connected': props<{ device: BluetoothDevice, server: BluetoothRemoteGATTServer }>(),
        'gatt cannot be connected': props<{ device: BluetoothDevice }>(),
        'gatt disconnected': props<{ device: BluetoothDevice }>(),
        'primary service connected': props<{ device: BluetoothDevice, service: BluetoothRemoteGATTService }>(),
        'primary service connection error': props<{ device: BluetoothDevice }>(),
        'primary characteristic connected': props<{ device: BluetoothDevice, characteristic: BluetoothRemoteGATTCharacteristic }>(),
        'primary characteristic connection error': props<{ device: BluetoothDevice }>()
    }
});

export const ACTION_CONFIGURE_HUB_TERMINATION = [
    ACTIONS_CONFIGURE_HUB.deviceConnectedGattUnavailable,
    ACTIONS_CONFIGURE_HUB.deviceDisconnected,
    ACTIONS_CONFIGURE_HUB.deviceConnectFailed,
    ACTIONS_CONFIGURE_HUB.gattCannotBeConnected,
    ACTIONS_CONFIGURE_HUB.gattDisconnected,
    ACTIONS_CONFIGURE_HUB.primaryServiceConnectionError,
    ACTIONS_CONFIGURE_HUB.primaryCharacteristicConnectionError
];
