import { Inject, Injectable } from '@angular/core';
import { ExtractTokenType, NAVIGATOR } from '../types';
import { Lpf2Hub } from './lpf2-hub';
import { Lpf2Tree } from './constants';
import { BluetoothDeviceWithGatt, Lpf2HubFactoryService } from './lpf2-hub-factory.service';
import { Lpf2ConnectionErrorFactoryService } from './errors';
import { Observable, shareReplay } from 'rxjs';
import { ILegoHubConfig, LEGO_HUB_CONFIG } from './i-lego-hub-config';

@Injectable()
export class Lpf2HubDiscoveryService {
    private readonly gattServerDisconnectEventName = 'gattserverdisconnected';

    constructor(
        @Inject(NAVIGATOR) private readonly navigator: ExtractTokenType<typeof NAVIGATOR>,
        private readonly lpf2HubFactoryService: Lpf2HubFactoryService,
        private readonly lpf2ConnectionErrorFactoryService: Lpf2ConnectionErrorFactoryService,
        @Inject(LEGO_HUB_CONFIG) private readonly config: ILegoHubConfig
    ) {
    }

    public async discoverLpf2Hub(): Promise<Lpf2Hub> {
        const device = await this.connectDevice();
        return this.connectToHub(device);
    }

    private async connectToHub(device: BluetoothDeviceWithGatt): Promise<Lpf2Hub> {
        const gatt = await this.connectGattServer(device);

        return this.lpf2HubFactoryService.createLpf2Gatt(
            new Observable<void>((subscriber) => {
                device.addEventListener(this.gattServerDisconnectEventName, () => subscriber.next());
            }).pipe(
                shareReplay()
            ),
            gatt
        );
    }

    private async connectGattServer(device: BluetoothDeviceWithGatt): Promise<BluetoothRemoteGATTServer> {
        let gatt: BluetoothRemoteGATTServer | null = null;

        for (let i = 0; i < this.config.maxGattConnectRetries && !gatt; i++) {
            gatt = await device.gatt.connect().catch(() => null);
        }
        if (!gatt) {
            throw this.lpf2ConnectionErrorFactoryService.createGattConnectionError();
        }
        return gatt;
    }

    private async connectDevice(): Promise<BluetoothDeviceWithGatt> {
        let device: BluetoothDevice;

        try {
            device = await this.navigator.bluetooth.requestDevice({
                filters: [
                    { services: [ Lpf2Tree.services.primary.id ] }
                ],
                optionalServices: [
                    Lpf2Tree.services.battery.id,
                    Lpf2Tree.services.deviceInformation.id
                ]
            });
        } catch (e) {
            throw this.lpf2ConnectionErrorFactoryService.createConnectionCancelledByUserError();
        }

        if (!device) {
            throw this.lpf2ConnectionErrorFactoryService.createConnectionCancelledByUserError();
        }
        if (this.isDeviceWithGatt(device)) {
            return device;
        } else {
            throw this.lpf2ConnectionErrorFactoryService.createGattUnavailableError();
        }
    }

    private isDeviceWithGatt(device: BluetoothDevice | BluetoothDeviceWithGatt): device is BluetoothDeviceWithGatt {
        return !!device.gatt;
    }
}
