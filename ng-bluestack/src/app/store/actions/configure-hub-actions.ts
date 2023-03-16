import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const HubActions = createActionGroup({
    source: 'hub actions',
    events: {
        'start discovery': emptyProps(),
        'device connected': props<{ device: BluetoothDevice }>(),
        'device disconnected': emptyProps(), // TODO: maybe something should be here?
        'gatt connected': props<{ service: BluetoothRemoteGATTServer }>(),
        'gatt disconnected': emptyProps(),  // TODO: maybe something should be here?
        'primary service discovered': props<{ service: BluetoothRemoteGATTService }>(),
        'primary characteristic discovered': props<{ characteristic: BluetoothRemoteGATTCharacteristic }>()
    }
})
