import { Injectable } from '@angular/core';
import { Lpf2Hub } from './lpf2-hub';
import { Observable } from 'rxjs';

export type BluetoothDeviceWithGatt = Omit<BluetoothDevice, 'gatt'> & {
    readonly gatt: BluetoothRemoteGATTServer;
};

@Injectable({ providedIn: 'root' })
export class Lpf2HubFactoryService {
    public createLpf2Gatt(
        onDisconnected$: Observable<void>,
        device: BluetoothRemoteGATTServer
    ): Lpf2Hub {
        return new Lpf2Hub(onDisconnected$, device);
    }
}
