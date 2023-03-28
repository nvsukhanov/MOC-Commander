import { Injectable } from '@angular/core';
import { HubCharacteristicsMessenger } from './hub-characteristics-messenger';
import { LoggingService } from '../logging';

@Injectable()
export class HubCharacteristicsMessengerFactoryService {
    constructor(
        private readonly logging: LoggingService
    ) {
    }

    public create(
        characteristic: BluetoothRemoteGATTCharacteristic
    ): HubCharacteristicsMessenger {
        return new HubCharacteristicsMessenger(
            characteristic,
            this.logging
        );
    }
}
