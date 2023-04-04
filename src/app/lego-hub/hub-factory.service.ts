import { Inject, Injectable } from '@angular/core';
import { Hub } from './hub';
import { Observable } from 'rxjs';
import { WINDOW } from '../types';
import { CharacteristicDataStreamFactoryService, OutboundMessengerFactoryService } from './messages';
import { HubPropertiesFeatureFactoryService, IoFeatureFactoryService } from './features';

export type BluetoothDeviceWithGatt = Omit<BluetoothDevice, 'gatt'> & {
    readonly gatt: BluetoothRemoteGATTServer;
};

@Injectable()
export class HubFactoryService {
    constructor(
        private readonly outboundMessengerFactoryService: OutboundMessengerFactoryService,
        private readonly propertiesFactoryService: HubPropertiesFeatureFactoryService,
        private readonly portInformationProviderFactoryService: IoFeatureFactoryService,
        private readonly characteristicsDataStreamFactoryService: CharacteristicDataStreamFactoryService,
        @Inject(WINDOW) private readonly window: Window
    ) {
    }

    public createLpuGatt(
        onDisconnected$: Observable<void>,
        device: BluetoothRemoteGATTServer
    ): Hub {
        return new Hub(
            onDisconnected$,
            device,
            this.outboundMessengerFactoryService,
            this.propertiesFactoryService,
            this.portInformationProviderFactoryService,
            this.characteristicsDataStreamFactoryService,
            this.window
        );
    }
}
