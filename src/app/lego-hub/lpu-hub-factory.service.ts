import { Injectable } from '@angular/core';
import { LpuHub } from './lpu-hub';
import { Observable } from 'rxjs';

export type BluetoothDeviceWithGatt = Omit<BluetoothDevice, 'gatt'> & {
    readonly gatt: BluetoothRemoteGATTServer;
};

@Injectable({ providedIn: 'root' })
export class LpuHubFactoryService {
    public createLpuGatt(
        onDisconnected$: Observable<void>,
        device: BluetoothRemoteGATTServer
    ): LpuHub {
        return new LpuHub(onDisconnected$, device);
    }
}
