import { Inject, Injectable } from '@angular/core';
import { ExtractTokenType, NAVIGATOR } from '../types';
import { Lpf2Device } from './lpf2-device';
import { LPF2_DISCOVERY_OPTIONS } from './constants';
import { Lpf2HubFactoryService } from './lpf2-hub-factory.service';
import { Lpf2ConnectionErrorFactoryService } from './errors';
import { Observable } from 'rxjs';

@Injectable()
export class Lpf2HubDiscoveryService {
    constructor(
        @Inject(NAVIGATOR) private readonly navigator: ExtractTokenType<typeof NAVIGATOR>,
        private readonly lpf2HubFactoryService: Lpf2HubFactoryService,
        private readonly lpf2: Lpf2ConnectionErrorFactoryService
    ) {
    }

    public async discoverL2PF(): Promise<Lpf2Device> {
        let device: BluetoothDevice;

        try {
            device = await this.navigator.bluetooth.requestDevice(LPF2_DISCOVERY_OPTIONS);
        } catch (e) {
            throw this.lpf2.createConnectionCancelledByUserError();
        }

        if (!device) {
            throw this.lpf2.createConnectionCancelledByUserError();
        }

        if (!device.gatt) {
            throw this.lpf2.createGattUnavailableError();
        }
        const gatt = await device.gatt.connect();
        const onDisconnected$ = new Observable<void>((subscriber) => {
            device.ongattserverdisconnected = (): void => subscriber.next();
        });
        return this.lpf2HubFactoryService.createLpf2Gatt(onDisconnected$, gatt);
    }
}
