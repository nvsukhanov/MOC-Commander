import { Inject, Injectable } from '@angular/core';
import { Hub } from './hub';
import { Observable } from 'rxjs';
import { WINDOW } from '../types';
import { AttachedIoFeatureFactoryService, HubPropertiesFeatureFactoryService, OutboundMessengerFactoryService, PortsFeatureFactoryService, } from './messages';
import { CharacteristicDataStreamFactoryService } from './messages/characteristic-data-stream-factory.service';

export type BluetoothDeviceWithGatt = Omit<BluetoothDevice, 'gatt'> & {
    readonly gatt: BluetoothRemoteGATTServer;
};

@Injectable()
export class HubFactoryService {
    constructor(
        private readonly outboundMessengerFactoryService: OutboundMessengerFactoryService,
        private readonly attachedIoProviderFactoryService: AttachedIoFeatureFactoryService,
        private readonly propertiesFactoryService: HubPropertiesFeatureFactoryService,
        private readonly portInformationProviderFactoryService: PortsFeatureFactoryService,
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
            this.attachedIoProviderFactoryService,
            this.portInformationProviderFactoryService,
            this.characteristicsDataStreamFactoryService,
            this.window
        );
    }
}
