import { Injectable } from '@angular/core';
import { LpuHub } from './lpu-hub';
import { Observable } from 'rxjs';
import { LpuCharacteristicsMessengerFactoryService } from './lpu-characteristics-messenger-factory.service';
import { LpuHubPropertiesFactoryService } from './lpu-hub-properties-factory.service';

export type BluetoothDeviceWithGatt = Omit<BluetoothDevice, 'gatt'> & {
    readonly gatt: BluetoothRemoteGATTServer;
};

@Injectable({ providedIn: 'root' })
export class LpuHubFactoryService {
    constructor(
        private readonly characteristicsMessengerFactoryService: LpuCharacteristicsMessengerFactoryService,
        private readonly propertiesFactoryService: LpuHubPropertiesFactoryService
    ) {
    }

    public createLpuGatt(
        onDisconnected$: Observable<void>,
        device: BluetoothRemoteGATTServer
    ): LpuHub {
        return new LpuHub(
            onDisconnected$,
            device,
            this.characteristicsMessengerFactoryService,
            this.propertiesFactoryService
        );
    }
}
