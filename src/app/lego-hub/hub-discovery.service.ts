import { Inject, Injectable } from '@angular/core';
import { ExtractTokenType, NAVIGATOR } from '../common';
import { HUB_SERVICE_UUID } from './constants';
import { BluetoothDeviceWithGatt } from './hub-factory.service';
import { LpuConnectionErrorFactoryService } from './errors';

@Injectable()
export class HubDiscoveryService {
    constructor(
        @Inject(NAVIGATOR) private readonly navigator: ExtractTokenType<typeof NAVIGATOR>,
        private readonly lpuConnectionErrorFactoryService: LpuConnectionErrorFactoryService,
    ) {
    }

    public async discoverHub(): Promise<BluetoothDeviceWithGatt> {
        return this.connectDevice();
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
