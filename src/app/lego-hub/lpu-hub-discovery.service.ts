import { Inject, Injectable } from '@angular/core';
import { ExtractTokenType, NAVIGATOR } from '../types';
import { LpuHub } from './lpu-hub';
import { HUB_SERVICE_UUID } from './constants';
import { BluetoothDeviceWithGatt, LpuHubFactoryService } from './lpu-hub-factory.service';
import { LpuConnectionErrorFactoryService } from './errors';
import { fromEvent, map } from 'rxjs';
import { ILegoHubConfig, LEGO_HUB_CONFIG } from './i-lego-hub-config';

@Injectable()
export class LpuHubDiscoveryService {
    private readonly gattServerDisconnectEventName = 'gattserverdisconnected';

    constructor(
        @Inject(NAVIGATOR) private readonly navigator: ExtractTokenType<typeof NAVIGATOR>,
        private readonly lpuHubFactoryService: LpuHubFactoryService,
        private readonly lpuConnectionErrorFactoryService: LpuConnectionErrorFactoryService,
        @Inject(LEGO_HUB_CONFIG) private readonly config: ILegoHubConfig
    ) {
    }

    public async discoverHub(): Promise<LpuHub> {
        const device = await this.connectDevice();
        return this.connectToHub(device);
    }

    private async connectToHub(device: BluetoothDeviceWithGatt): Promise<LpuHub> {
        const gatt = await this.connectGattServer(device);

        return this.lpuHubFactoryService.createLpuGatt(
            fromEvent(device, this.gattServerDisconnectEventName).pipe(map(() => void 0)),
            gatt
        );
    }

    private async connectGattServer(device: BluetoothDeviceWithGatt): Promise<BluetoothRemoteGATTServer> {
        let gatt: BluetoothRemoteGATTServer | null = null;

        for (let i = 0; i < this.config.maxGattConnectRetries && !gatt; i++) {
            gatt = await device.gatt.connect().catch(() => null);
        }
        if (!gatt) {
            throw this.lpuConnectionErrorFactoryService.createGattConnectionError();
        }
        return gatt;
    }

    private async connectDevice(): Promise<BluetoothDeviceWithGatt> {
        let device: BluetoothDevice;

        try {
            device = await this.navigator.bluetooth.requestDevice({
                filters: [
                    { services: [ HUB_SERVICE_UUID ] }
                ]
            });
        } catch (e) {
            throw this.lpuConnectionErrorFactoryService.createConnectionCancelledByUserError();
        }

        if (!device) {
            throw this.lpuConnectionErrorFactoryService.createConnectionCancelledByUserError();
        }
        if (this.isDeviceWithGatt(device)) {
            return device;
        } else {
            throw this.lpuConnectionErrorFactoryService.createGattUnavailableError();
        }
    }

    private isDeviceWithGatt(device: BluetoothDevice | BluetoothDeviceWithGatt): device is BluetoothDeviceWithGatt {
        return !!device.gatt;
    }
}
