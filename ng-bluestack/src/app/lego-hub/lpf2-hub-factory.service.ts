import { Injectable } from '@angular/core';
import { Lpf2Device } from './lpf2-device';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class Lpf2HubFactoryService {
    public createLpf2Gatt(
        onDisconnected$: Observable<void>,
        device: BluetoothRemoteGATTServer
    ): Lpf2Device {
        return new Lpf2Device(onDisconnected$, device);
    }
}
