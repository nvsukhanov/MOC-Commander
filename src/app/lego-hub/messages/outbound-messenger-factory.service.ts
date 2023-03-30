import { Injectable } from '@angular/core';
import { OutboundMessenger } from './outbound-messenger';
import { LoggingService } from '../../logging';

@Injectable()
export class OutboundMessengerFactoryService {
    constructor(
        private readonly logging: LoggingService
    ) {
    }

    public create(
        characteristic: BluetoothRemoteGATTCharacteristic
    ): OutboundMessenger {
        return new OutboundMessenger(
            characteristic,
            this.logging
        );
    }
}
