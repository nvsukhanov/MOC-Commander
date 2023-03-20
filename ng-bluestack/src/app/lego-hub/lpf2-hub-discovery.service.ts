import { Inject, Injectable } from '@angular/core';
import { ExtractTokenType, NAVIGATOR } from '../types';
import { Lpf2Device } from './lpf2-device';
import { LEGO_SERVICES_UUIDS, LPF2_CHARACTERISTICS_UUID, LPF2_DISCOVERY_OPTIONS } from './constants';
import { Lpf2HubFactoryService } from './lpf2-hub-factory.service';
import { Lpf2ConnectionErrorFactoryService } from './errors';
import { Observable } from 'rxjs';
import { ILegoHubConfig, LEGO_HUB_CONFIG } from './i-lego-hub-config';

@Injectable()
export class Lpf2HubDiscoveryService {
    constructor(
        @Inject(NAVIGATOR) private readonly navigator: ExtractTokenType<typeof NAVIGATOR>,
        private readonly lpf2HubFactoryService: Lpf2HubFactoryService,
        private readonly lpf2ConnectionErrorFactoryService: Lpf2ConnectionErrorFactoryService,
        @Inject(LEGO_HUB_CONFIG) private readonly config: ILegoHubConfig
    ) {
    }

    public async discoverL2PF(): Promise<Lpf2Device> {
        const device = await this.connectDevice();
        const gatt = await this.connectGattServer(device);

        // coneect to service
        const srv = await gatt.getPrimaryService(LEGO_SERVICES_UUIDS.LPF2PrimaryService);
        const char = await srv.getCharacteristic(LPF2_CHARACTERISTICS_UUID);

        return this.lpf2HubFactoryService.createLpf2Gatt(
            new Observable<void>((subscriber) => {
                device.ongattserverdisconnected = (): void => subscriber.next();
            }),
            gatt
        );
    }

    private async connectGattServer(device: BluetoothDevice): Promise<BluetoothRemoteGATTServer> {
        let gatt: BluetoothRemoteGATTServer | null = null;

        for (let i = 0; i < this.config.maxGattConnectRetries && !gatt; i++) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            gatt = await device.gatt!.connect().catch(() => null);
        }
        if (!gatt) {
            throw this.lpf2ConnectionErrorFactoryService.createGattConnectionError();
        }
        return gatt;
    }

    private async connectDevice(): Promise<BluetoothDevice> {
        let device: BluetoothDevice;

        try {
            device = await this.navigator.bluetooth.requestDevice(LPF2_DISCOVERY_OPTIONS);
        } catch (e) {
            throw this.lpf2ConnectionErrorFactoryService.createConnectionCancelledByUserError();
        }

        if (!device) {
            throw this.lpf2ConnectionErrorFactoryService.createConnectionCancelledByUserError();
        }
        this.ensureGattPresent(device);

        return device;
    }

    private ensureGattPresent(device: BluetoothDevice): void {
        if (!device.gatt) {
            throw this.lpf2ConnectionErrorFactoryService.createGattUnavailableError();
        }
    }
}
