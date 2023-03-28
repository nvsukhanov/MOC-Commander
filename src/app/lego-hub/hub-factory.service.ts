import { Inject, Injectable } from '@angular/core';
import { Hub } from './hub';
import { Observable } from 'rxjs';
import { HubCharacteristicsMessengerFactoryService } from './hub-characteristics-messenger-factory.service';
import { HubPropertyProviderFactoryService } from './hub-property-provider-factory.service';
import { WINDOW } from '../types';
import { HubAttachedIoProviderFactoryService } from './hub-attached-io-provider-factory.service';

export type BluetoothDeviceWithGatt = Omit<BluetoothDevice, 'gatt'> & {
    readonly gatt: BluetoothRemoteGATTServer;
};

@Injectable()
export class HubFactoryService {
    constructor(
        private readonly characteristicsMessengerFactoryService: HubCharacteristicsMessengerFactoryService,
        private readonly attachedIoProviderFactoryService: HubAttachedIoProviderFactoryService,
        private readonly propertiesFactoryService: HubPropertyProviderFactoryService,
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
            this.characteristicsMessengerFactoryService,
            this.propertiesFactoryService,
            this.attachedIoProviderFactoryService,
            this.window
        );
    }
}
